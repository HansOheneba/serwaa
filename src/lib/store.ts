"use client";

// The browser's copy of what the signed-in person can see. It loads once from the
// server, refreshes when the tab regains focus, and every action sends the change to
// the server, which checks permissions and returns the updated view.

import { useEffect, useSyncExternalStore } from "react";
import * as api from "./actions";
import { emptyState, type Result, type State } from "./domain";

export * from "./domain";

let state: State = emptyState;
let loading: Promise<void> | null = null;
let lastLoad = 0;
const listeners = new Set<() => void>();

function set(next: State) {
  state = next;
  lastLoad = Date.now();
  listeners.forEach((l) => l());
}

export function refresh(): Promise<void> {
  loading ??= api
    .loadWorkspace()
    .then(set)
    .catch(() => set({ ...state, ready: true }))
    .finally(() => (loading = null));
  return loading;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Pick up changes others made while this tab was in the background (at most every 20s).
  const onFocus = () => Date.now() - lastLoad > 20_000 && refresh();
  window.addEventListener("focus", onFocus);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("focus", onFocus);
  };
}

export function useWorkspace(): State {
  const s = useSyncExternalStore(subscribe, () => state, () => emptyState);
  useEffect(() => {
    if (!state.ready) refresh();
  }, []);
  return s;
}

type Returned<T> = Omit<Awaited<T>, "ws">;

/** Sends an action to the server and takes the fresh view it returns. */
function call<A extends unknown[], R extends Result & { ws: State }>(fn: (...a: A) => Promise<R>) {
  return async (...args: A): Promise<Returned<R>> => {
    try {
      const { ws, ...rest } = await fn(...args);
      set(ws);
      return rest as Returned<R>;
    } catch {
      return { ok: false, message: "We couldn't reach Serwaa. Check your connection and try again." } as Returned<R>;
    }
  };
}

export const submitApplication = call(api.submitApplication);
export const respondToRequest = call(api.respondToRequest);
export const payFacility = call(api.payFacility);
export const setAutopay = call(api.setAutopay);
export const setPayout = call(api.setPayout);
export const registerInterest = call(api.registerInterest);
export const withdrawInterest = call(api.withdrawInterest);
export const toggleWatch = call(api.toggleWatch);
export const updatePrefs = call(api.updatePrefs);
export const setAlerts = call(api.setAlerts);
export const invest = call(api.invest);
export const confirmMomo = call(api.confirmMomo);
export const withdrawCash = call(api.withdrawCash);
export const reinvestCash = call(api.reinvestCash);
export const requestAllocation = call(api.requestAllocation);
export const updateMandate = call(api.updateMandate);
export const inviteMember = call(api.inviteMember);
export const setMemberRole = call(api.setMemberRole);
export const removeMember = call(api.removeMember);
export const assignOfficer = call(api.assignOfficer);
export const requestInformation = call(api.requestInformation);
export const acceptResponse = call(api.acceptResponse);
export const advanceStage = call(api.advanceStage);
export const decide = call(api.decide);
export const approveCampaignStage = call(api.approveCampaignStage);
export const disburseCampaign = call(api.disburseCampaign);
export const agreeAllocation = call(api.agreeAllocation);
export const matchPayment = call(api.matchPayment);
export const addStaff = call(api.addStaff);
export const setStaffRoles = call(api.setStaffRoles);
export const updateFees = call(api.updateFees);
export const setRestricted = call(api.setRestricted);
export const markAllRead = call(api.markAllRead);

export async function signOut() {
  await api.signOut();
  set({ ...emptyState, ready: true });
}

// Stock photography, free to use under the Unsplash License (unsplash.com/license).
// Served from Unsplash's CDN; credits are listed on the brand page.

export type Photo = { src: string; alt: string; credit: string; profile: string; page: string };

const u = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const photos = {
  shopkeeper: {
    src: u("1687422808311-a776f467a468"),
    alt: "A shop owner smiling behind the counter of her store",
    credit: "Ali Mkumbwa",
    profile: "https://unsplash.com/@mkumbwajr",
    page: "https://unsplash.com/photos/EOkN2pRjFsg",
  },
  tailor: {
    src: u("1687422809069-0fa3546b8471"),
    alt: "A tailor smiling as he works at his sewing machine",
    credit: "Ali Mkumbwa",
    profile: "https://unsplash.com/@mkumbwajr",
    page: "https://unsplash.com/photos/cU3xxfbB9Es",
  },
  carpenter: {
    src: u("1687422810663-c316494f725a"),
    alt: "A carpenter smiling as he works on a piece of wood in his workshop",
    credit: "Ali Mkumbwa",
    profile: "https://unsplash.com/@mkumbwajr",
    page: "https://unsplash.com/photos/PxlKOcj0a3Q",
  },
  vendorPhone: {
    src: u("1687422808248-f807f4ea2a2e"),
    alt: "A food vendor in an apron checking his phone",
    credit: "Ali Mkumbwa",
    profile: "https://unsplash.com/@mkumbwajr",
    page: "https://unsplash.com/photos/uk3ey_vhDKA",
  },
  investorLaptop: {
    src: u("1604933762021-54a5858c9832"),
    alt: "A woman reviewing her investments on a laptop",
    credit: "Daniel Thomas",
    profile: "https://unsplash.com/@spintracer",
    page: "https://unsplash.com/photos/HA-0i0E7sq4",
  },
  investorPhone: {
    src: u("1758876202167-f81c995c3fdc"),
    alt: "A young woman on a phone call at her desk",
    credit: "Vitaly Gariev",
    profile: "https://unsplash.com/@silverkblack",
    page: "https://unsplash.com/photos/n1yI8oExVns",
  },
  boardroom: {
    src: u("1573164574572-cb89e39749b4"),
    alt: "An investment team meeting around a boardroom table",
    credit: "Christina @ wocintechchat.com",
    profile: "https://unsplash.com/@wocintechchat",
    page: "https://unsplash.com/photos/faEfWCdOKIg",
  },
  workshop: {
    src: u("1637997840862-9aafaf835eed"),
    alt: "A team of women working at sewing machines in a garment workshop",
    credit: "Kevin Menya",
    profile: "https://unsplash.com/@kevmenya",
    page: "https://unsplash.com/photos/aH1uiH-Ht_w",
  },
} satisfies Record<string, Photo>;

import type { Product} from "@admin/types";
import { PRODUCT_STATUS } from "@admin/types";

const BASE_PRODUCTS = [
  {
    name: "Wireless Noise-Canceling Headphones",
    slug: "wireless-noise-canceling-headphones",
    description:
      "Premium over-ear wireless headphones with active noise cancellation and 30h battery.",
    price: 299.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=60",
  },
  {
    name: "Ergonomic Mechanical Keyboard",
    slug: "ergonomic-mechanical-keyboard",
    description:
      "Custom mechanical keyboard with hot-swappable switches and RGB backlighting.",
    price: 149.5,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100&auto=format&fit=crop&q=60",
  },
  {
    name: "Minimalist Leather Backpack",
    slug: "minimalist-leather-backpack",
    description:
      "Handcrafted full-grain leather everyday backpack with 15-inch laptop compartment.",
    price: 185.0,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&auto=format&fit=crop&q=60",
  },
  {
    name: "Smart Fitness Watch Ultra",
    slug: "smart-fitness-watch-ultra",
    description:
      "Rugged GPS sports watch with continuous heart rate monitoring and titanium case.",
    price: 349.0,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=60",
  },
  {
    name: "Ceramic Coffee Mug (Set of 4)",
    slug: "ceramic-coffee-mug-set-of-4",
    description:
      "Artisan stoneware ceramic mugs, microwave and dishwasher safe.",
    price: 34.99,
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100&auto=format&fit=crop&q=60",
  },
  {
    name: "USB-C Multi-Port Hub Pro",
    slug: "usb-c-multi-port-hub-pro",
    description:
      "7-in-1 aluminum USB-C hub with 4K HDMI, 100W Power Delivery, and SD card reader.",
    price: 59.99,
    image:
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=100&auto=format&fit=crop&q=60",
  },
  {
    name: "Organic Cotton T-Shirt",
    slug: "organic-cotton-t-shirt",
    description:
      "100% certified organic heavyweight cotton classic crewneck tee.",
    price: 24.95,
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&auto=format&fit=crop&q=60",
  },
  {
    name: "Portable Bluetooth Speaker",
    slug: "portable-bluetooth-speaker",
    description:
      "IPX7 waterproof portable speaker with 360-degree deep bass sound.",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&auto=format&fit=crop&q=60",
  },
  {
    name: "Stainless Steel Water Bottle 1L",
    slug: "stainless-steel-water-bottle-1l",
    description:
      "Double-walled vacuum insulated bottle keeping drinks cold for 24 hours.",
    price: 29.0,
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100&auto=format&fit=crop&q=60",
  },
  {
    name: "Adjustable Desk Lamp LED",
    slug: "adjustable-desk-lamp-led",
    description:
      "Dimmable architect LED task light with touch control and eye-care diffuser.",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=100&auto=format&fit=crop&q=60",
  },
  {
    name: 'Ultra-Wide Curved Gaming Monitor 34"',
    slug: "ultra-wide-curved-gaming-monitor-34",
    description:
      "144Hz 1ms WQHD curved gaming monitor with HDR400 and FreeSync Premium.",
    price: 699.99,
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=100&auto=format&fit=crop&q=60",
  },
  {
    name: "Wireless Ergonomic Vertical Mouse",
    slug: "wireless-ergonomic-vertical-mouse",
    description:
      "Natural handshake angle vertical mouse reducing forearm strain and wrist pressure.",
    price: 69.95,
    image:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=100&auto=format&fit=crop&q=60",
  },
  {
    name: "Aluminum Laptop Stand Riser",
    slug: "aluminum-laptop-stand-riser",
    description:
      "Ergonomic ventilated aluminum stand compatible with all MacBook and PC laptops.",
    price: 39.99,
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=100&auto=format&fit=crop&q=60",
  },
  {
    name: "Noise-Isolating In-Ear Earbuds",
    slug: "noise-isolating-in-ear-earbuds",
    description:
      "True wireless earbuds with transparency mode and wireless charging case.",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&auto=format&fit=crop&q=60",
  },
  {
    name: "Standing Desk Converter",
    slug: "standing-desk-converter",
    description:
      "Gas spring dual-tier height-adjustable sit-stand workstation riser.",
    price: 219.0,
    image:
      "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=100&auto=format&fit=crop&q=60",
  },
  {
    name: "Leather Desk Pad Protector",
    slug: "leather-desk-pad-protector",
    description:
      "Waterproof dual-sided PU leather oversized desk blotter and mouse pad.",
    price: 29.5,
    image:
      "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=100&auto=format&fit=crop&q=60",
  },
  {
    name: "Smart Home Security Camera",
    slug: "smart-home-security-camera",
    description:
      "2K indoor Wi-Fi camera with 360-degree pan/tilt and AI motion detection.",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=100&auto=format&fit=crop&q=60",
  },
  {
    name: "Mechanical Pencil Set 0.5mm",
    slug: "mechanical-pencil-set-0-5mm",
    description:
      "Drafting metal mechanical pencil with extra polymer lead refills and erasers.",
    price: 15.99,
    image:
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=100&auto=format&fit=crop&q=60",
  },
  {
    name: "Fast Wireless Charging Pad 15W",
    slug: "fast-wireless-charging-pad-15w",
    description:
      "Qi-certified ultra-slim fast inductive charging station with LED indicator.",
    price: 32.5,
    image:
      "https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=100&auto=format&fit=crop&q=60",
  },
  {
    name: "Thermal Insulated Travel Flask",
    slug: "thermal-insulated-travel-flask",
    description:
      "Leak-proof travel tumbler with flip lid and tea infuser basket.",
    price: 27.99,
    image:
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=100&auto=format&fit=crop&q=60",
  },
];

const STATUSES: Array<Product["status"]> = [
  PRODUCT_STATUS.ACTIVE,
  PRODUCT_STATUS.DRAFT,
  PRODUCT_STATUS.INACTIVE,
];

export const SAMPLE_PRODUCTS: Product[] = Array.from(
  { length: 65 },
  (_, index) => {
    const base = BASE_PRODUCTS[index % BASE_PRODUCTS.length];
    const id = index + 1;
    const status = STATUSES[index % 3];
    const stock = (index * 7 + 3) % 120;
    const version = Math.floor(index / BASE_PRODUCTS.length);
    const name = version > 0 ? `${base.name} (V${version + 1})` : base.name;
    const slug =
      version > 0 ? `${base.slug}-v${version + 1}` : `${base.slug}-${id}`;
    const dateMonth = String((index % 6) + 1).padStart(2, "0");
    const dateDay = String((index % 28) + 1).padStart(2, "0");
    const createdAt = `2026-${dateMonth}-${dateDay}T10:00:00.000Z`;
    const updatedAt = `2026-${dateMonth}-${dateDay}T12:30:00.000Z`;

    return {
      id,
      name,
      slug,
      description: base.description,
      price: parseFloat((base.price + (index % 5) * 5).toFixed(2)),
      status,
      stock,
      image: base.image,
      createdAt,
      updatedAt,
    };
  },
);

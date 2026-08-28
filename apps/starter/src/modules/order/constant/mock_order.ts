import type { Order, OrderItem } from "@admin/types";
import { ORDER_STATUS, PAYMENT_STATUS } from "@admin/types";

const CUSTOMERS = [
  {
    name: "Sarah Jenkins",
    email: "sarah.jenkins@example.com",
    phone: "+1 (555) 234-5678",
    address: "742 Evergreen Terrace, Springfield, OR 97477",
  },
  {
    name: "Alexander Vance",
    email: "alex.vance@example.com",
    phone: "+1 (555) 876-5432",
    address: "1048 Ocean Avenue, Santa Monica, CA 90401",
  },
  {
    name: "Elena Rostova",
    email: "elena.rostova@example.com",
    phone: "+1 (555) 345-6789",
    address: "350 5th Avenue, New York, NY 10118",
  },
  {
    name: "Marcus Chen",
    email: "marcus.chen@example.com",
    phone: "+1 (555) 987-6543",
    address: "420 Market Street, San Francisco, CA 94105",
  },
  {
    name: "Olivia Parker",
    email: "olivia.parker@example.com",
    phone: "+1 (555) 456-7890",
    address: "1600 Amphitheatre Pkwy, Mountain View, CA 94043",
  },
  {
    name: "Liam O'Connor",
    email: "liam.oconnor@example.com",
    phone: "+1 (555) 654-3210",
    address: "221B Baker Street, Boston, MA 02108",
  },
  {
    name: "Sophia Martinez",
    email: "sophia.martinez@example.com",
    phone: "+1 (555) 567-8901",
    address: "500 South Congress Ave, Austin, TX 78704",
  },
  {
    name: "David Kim",
    email: "david.kim@example.com",
    phone: "+1 (555) 789-0123",
    address: "1200 Westlake Ave N, Seattle, WA 98109",
  },
  {
    name: "Emma Watson",
    email: "emma.watson@example.com",
    phone: "+1 (555) 890-1234",
    address: "800 N Michigan Ave, Chicago, IL 60611",
  },
  {
    name: "James Wilson",
    email: "james.wilson@example.com",
    phone: "+1 (555) 901-2345",
    address: "100 Universal City Plaza, Universal City, CA 91608",
  },
];

export const ORDER_ITEMS_POOL = [
  {
    productId: 1,
    productName: "Wireless Noise-Canceling Headphones",
    productImage:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=60",
    price: 299.99,
  },
  {
    productId: 2,
    productName: "Ergonomic Mechanical Keyboard",
    productImage:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100&auto=format&fit=crop&q=60",
    price: 149.5,
  },
  {
    productId: 3,
    productName: "Minimalist Leather Backpack",
    productImage:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&auto=format&fit=crop&q=60",
    price: 185.0,
  },
  {
    productId: 4,
    productName: "Smart Fitness Watch Ultra",
    productImage:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=60",
    price: 349.0,
  },
  {
    productId: 5,
    productName: "USB-C Multi-Port Hub Pro",
    productImage:
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=100&auto=format&fit=crop&q=60",
    price: 59.99,
  },
  {
    productId: 6,
    productName: "Portable Bluetooth Speaker",
    productImage:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&auto=format&fit=crop&q=60",
    price: 89.99,
  },
  {
    productId: 7,
    productName: "Stainless Steel Water Bottle 1L",
    productImage:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100&auto=format&fit=crop&q=60",
    price: 29.0,
  },
];

const ORDER_STATUS_CYCLE: ORDER_STATUS[] = [
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CANCELLED,
];

const PAYMENT_STATUS_CYCLE: PAYMENT_STATUS[] = [
  PAYMENT_STATUS.PAID,
  PAYMENT_STATUS.PAID,
  PAYMENT_STATUS.PAID,
  PAYMENT_STATUS.PENDING,
  PAYMENT_STATUS.REFUNDED,
  PAYMENT_STATUS.FAILED,
];

const PAYMENT_METHODS = [
  "Credit Card (Visa)",
  "Credit Card (Mastercard)",
  "Apple Pay",
  "PayPal",
  "Stripe",
];

export const SAMPLE_ORDERS: Order[] = Array.from(
  { length: 50 },
  (_, index) => {
    const id = index + 1;
    const orderNumber = `ORD-2026-${String(1000 + id)}`;
    const customer = CUSTOMERS[index % CUSTOMERS.length];
    const status = ORDER_STATUS_CYCLE[index % ORDER_STATUS_CYCLE.length];
    const paymentStatus =
      status === ORDER_STATUS.CANCELLED
        ? PAYMENT_STATUS.REFUNDED
        : PAYMENT_STATUS_CYCLE[index % PAYMENT_STATUS_CYCLE.length];
    const paymentMethod = PAYMENT_METHODS[index % PAYMENT_METHODS.length];

    const dateMonth = String((index % 8) + 1).padStart(2, "0");
    const dateDay = String((index % 28) + 1).padStart(2, "0");
    const createdAt = `2026-${dateMonth}-${dateDay}T09:15:00.000Z`;
    const updatedAt = `2026-${dateMonth}-${dateDay}T14:30:00.000Z`;

    const itemCount = (index % 3) + 1;
    const items: OrderItem[] = Array.from(
      { length: itemCount },
      (__, itemIdx) => {
        const poolItem =
          ORDER_ITEMS_POOL[(index + itemIdx) % ORDER_ITEMS_POOL.length];
        const quantity = (itemIdx % 2) + 1;
        const subtotal = parseFloat((poolItem.price * quantity).toFixed(2));

        return {
          id: index * 10 + itemIdx + 1,
          orderId: id,
          productId: poolItem.productId,
          productName: poolItem.productName,
          productImage: poolItem.productImage,
          price: poolItem.price,
          quantity,
          subtotal,
          createdAt,
        };
      },
    );

    const subtotal = parseFloat(
      items.reduce((acc, curr) => acc + curr.subtotal, 0).toFixed(2),
    );
    const tax = parseFloat((subtotal * 0.08).toFixed(2));
    const shippingFee = subtotal > 150 ? 0 : 15.0;
    const totalAmount = parseFloat((subtotal + tax + shippingFee).toFixed(2));

    return {
      id,
      orderNumber,
      userId: `user-${(index % 10) + 1}`,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      status,
      paymentStatus,
      paymentMethod,
      subtotal,
      tax,
      shippingFee,
      totalAmount,
      shippingAddress: customer.address,
      notes:
        index % 5 === 0 ? "Please leave parcel by the front door." : null,
      createdAt,
      updatedAt,
      items,
    };
  },
);

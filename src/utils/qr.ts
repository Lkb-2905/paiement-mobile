import { cyrb53, hashToBase36 } from './hash';

const QR_SECRET = 'cmr-fan-qr-v1';
const SLOT_MS = 30000;

export const getTimeSlot = (now = Date.now()) =>
  Math.floor(now / SLOT_MS);

export const buildQrPayload = (qrCodeHash: string, now = Date.now()) => {
  const slot = getTimeSlot(now);
  const signature = hashToBase36(
    cyrb53(`${QR_SECRET}.${qrCodeHash}.${slot}`)
  );
  return `${qrCodeHash}.${slot}.${signature}`;
};

export const isQrPayloadValid = (
  payload: string,
  qrCodeHash: string,
  now = Date.now()
) => {
  const [payloadHash, slotValue, signature] = payload.split('.');
  if (!payloadHash || !slotValue || !signature) return false;
  if (payloadHash !== qrCodeHash) return false;
  const slot = Number(slotValue);
  if (Number.isNaN(slot)) return false;
  const currentSlot = getTimeSlot(now);
  const allowedSlots = [currentSlot - 1, currentSlot, currentSlot + 1];
  if (!allowedSlots.includes(slot)) return false;
  const expected = hashToBase36(
    cyrb53(`${QR_SECRET}.${qrCodeHash}.${slot}`)
  );
  return expected === signature;
};

export const secondsRemainingInSlot = (now = Date.now()) => {
  const remainder = SLOT_MS - (now % SLOT_MS);
  return Math.max(0, Math.ceil(remainder / 1000));
};

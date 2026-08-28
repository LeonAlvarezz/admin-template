import React, { useState } from "react";
import {
  Button,
  ConfirmModal,
  CopyIcon,
  DownloadIcon,
  Field,
  FieldLabel,
  Input,
  KeyIcon,
  Modal,
  ModalBody,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  QrCodeIcon,
  ShieldCheckIcon,
  Switch,
  Tag,
  copyToClipboard,
  toast,
} from "@admin/core";
import { INITIAL_2FA_STATE } from "../constant/mock_settings";
import type { TwoFactorData } from "../constant/mock_settings";

export function TwoFactorSection() {
  const [twoFactor, setTwoFactor] = useState<TwoFactorData>(INITIAL_2FA_STATE);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isDisableConfirmOpen, setIsDisableConfirmOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopySecret = async () => {
    await copyToClipboard(twoFactor.secret);
    toast.success("Secret key copied to clipboard");
  };

  const handleCopyBackupCodes = async () => {
    await copyToClipboard(twoFactor.backupCodes.join("\n"));
    toast.success("Backup recovery codes copied to clipboard");
  };

  const handleDownloadBackupCodes = () => {
    const textContent = `Admin Template - 2FA Recovery Codes\nGenerated: ${new Date().toISOString()}\n\n${twoFactor.backupCodes.join("\n")}\n\nKeep these codes in a safe place. Each code can only be used once.`;
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "2fa-recovery-codes.txt";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Recovery codes downloaded");
  };

  const handleEnable2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.trim().length < 6) {
      toast.error("Please enter a valid 6-digit authentication code.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setTwoFactor((prev) => ({ ...prev, isEnabled: true }));
      setIsSetupOpen(false);
      setVerificationCode("");
      toast.success("Two-Factor Authentication is now enabled!");
    }, 400);
  };

  const handleDisable2FA = () => {
    setTwoFactor((prev) => ({ ...prev, isEnabled: false }));
    setIsDisableConfirmOpen(false);
    toast.success("Two-Factor Authentication has been disabled");
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-semibold text-foreground">
              Two-Factor Authentication (2FA)
            </h2>
            {twoFactor.isEnabled ? (
              <Tag color="emerald">Enabled</Tag>
            ) : (
              <Tag color="slate">Disabled</Tag>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Add an extra layer of security to your account using an authenticator app (Google Authenticator, 1Password, Authy).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {twoFactor.isEnabled ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsBackupOpen(true)}
              >
                View Recovery Codes
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setIsDisableConfirmOpen(true)}
              >
                Disable 2FA
              </Button>
            </>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={() => setIsSetupOpen(true)}
            >
              Enable 2FA
            </Button>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between p-3.5 rounded-lg bg-muted/20 border border-border">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ShieldCheckIcon className="size-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Authenticator App Protection
            </p>
            <p className="text-xs text-muted-foreground">
              {twoFactor.isEnabled
                ? "Your account requires a TOTP code during sign-in."
                : "Not configured yet. Recommended for all administrators."}
            </p>
          </div>
        </div>
        <Switch
          checked={twoFactor.isEnabled}
          onChange={(checked) => {
            if (checked) {
              setIsSetupOpen(true);
            } else {
              setIsDisableConfirmOpen(true);
            }
          }}
        />
      </div>

      {/* Setup 2FA Modal */}
      <Modal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        size="lg"
      >
        <ModalHeader>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <QrCodeIcon className="size-5" />
            </div>
            <div>
              <ModalTitle>Set Up Two-Factor Authentication</ModalTitle>
              <ModalDescription>
                Follow the steps below to configure your authenticator app.
              </ModalDescription>
            </div>
          </div>
        </ModalHeader>

        <form onSubmit={handleEnable2FA}>
          <ModalBody className="space-y-5">
            {/* Step 1: Scan QR */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Step 1: Scan QR Code
              </span>
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-border bg-muted/10">
                {/* Visual mock QR Code */}
                <div className="size-36 p-2 rounded-lg bg-white border border-border flex items-center justify-center shrink-0 shadow-sm">
                  <svg
                    viewBox="0 0 100 100"
                    className="size-full text-neutral-900 fill-current"
                  >
                    {/* Simplified sharp QR code graphic */}
                    <rect x="10" y="10" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                    <rect x="20" y="20" width="10" height="10" />
                    <rect x="60" y="10" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                    <rect x="70" y="20" width="10" height="10" />
                    <rect x="10" y="60" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                    <rect x="20" y="70" width="10" height="10" />
                    <rect x="50" y="20" width="5" height="15" />
                    <rect x="20" y="50" width="15" height="5" />
                    <rect x="50" y="50" width="10" height="10" />
                    <rect x="65" y="50" width="15" height="5" />
                    <rect x="50" y="70" width="20" height="10" />
                    <rect x="80" y="75" width="10" height="15" />
                  </svg>
                </div>

                <div className="space-y-2 text-center sm:text-left">
                  <p className="text-xs text-muted-foreground">
                    Scan this QR code with Google Authenticator, 1Password, or any standard TOTP app.
                  </p>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-foreground">
                      Manual Secret Key:
                    </span>
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 rounded bg-muted font-mono text-xs text-foreground tracking-wider font-semibold">
                        {twoFactor.secret}
                      </code>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCopySecret}
                        className="gap-1 text-xs"
                      >
                        <CopyIcon className="size-3.5" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Verification Code */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Step 2: Verify 6-Digit Code
              </span>
              <Field>
                <FieldLabel htmlFor="totp-code" required>
                  Authentication Code
                </FieldLabel>
                <Input
                  id="totp-code"
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 123456"
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(
                      e.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                  className="font-mono text-center tracking-widest text-base"
                  required
                />
              </Field>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSetupOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || verificationCode.length < 6}
            >
              {isSubmitting ? "Verifying..." : "Verify & Enable"}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Recovery Codes Modal */}
      <Modal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        size="md"
      >
        <ModalHeader>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <KeyIcon className="size-5" />
            </div>
            <div>
              <ModalTitle>2FA Recovery Backup Codes</ModalTitle>
              <ModalDescription>
                Store these single-use codes safely in case you lose access to your device.
              </ModalDescription>
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-4 rounded-xl border border-border bg-muted/15 font-mono text-center text-sm font-semibold tracking-wider">
            {twoFactor.backupCodes.map((code) => (
              <div
                key={code}
                className="py-1.5 px-2 rounded bg-card border border-border/50 text-foreground"
              >
                {code}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyBackupCodes}
              className="gap-1.5"
            >
              <CopyIcon className="size-3.5" />
              Copy Codes
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadBackupCodes}
              className="gap-1.5"
            >
              <DownloadIcon className="size-3.5" />
              Download .txt
            </Button>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="button" onClick={() => setIsBackupOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* Disable 2FA Confirm Modal */}
      <ConfirmModal
        isOpen={isDisableConfirmOpen}
        setIsOpen={setIsDisableConfirmOpen}
        title="Disable Two-Factor Authentication?"
        description="Are you sure you want to turn off 2FA? This will make your account significantly less secure."
        confirmText="Yes, Disable 2FA"
        variant="destructive"
        onConfirm={handleDisable2FA}
      />
    </div>
  );
}

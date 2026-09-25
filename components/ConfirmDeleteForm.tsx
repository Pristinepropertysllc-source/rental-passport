'use client';

export function ConfirmDeleteForm({
  action,
  hiddenName,
  hiddenValue,
  confirmMessage,
  buttonLabel
}: {
  action: (formData: FormData) => void | Promise<void>;
  hiddenName: string;
  hiddenValue: string;
  confirmMessage: string;
  buttonLabel: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <input type="hidden" name={hiddenName} value={hiddenValue} />
      <button className="btn btn-danger btn-sm" type="submit">
        {buttonLabel}
      </button>
    </form>
  );
}

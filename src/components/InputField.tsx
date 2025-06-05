export interface InputFieldProps {
  name: string;
  label: string;
  value: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export default function InputField({ name, label, value, onChange }: InputFieldProps) {
  return (
    <div className="flex items-center gap-4">
      <label htmlFor={name} className="w-56 text-right text-gray-700 font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="number"
        min="0"
        value={value}
        onChange={onChange}
        className="flex-1 px-3 py-2 border rounded text-right focus:ring-2"
      />
    </div>
  );
}

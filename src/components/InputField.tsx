export interface InputFieldProps {
  name: string;
  label: string;
  value: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export default function InputField({ name, label, value, onChange }: InputFieldProps) {
  return (
    <div className="flex justify-between mb-2">
      <label
        htmlFor={name}
        className="w-44 text-right mr-2"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="number"
        min="0"
        value={value}
        onChange={onChange}
        className="w-52 px-2 py-1 border rounded text-right"
      />
    </div>
  );
}

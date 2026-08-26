export default function FormField({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  error, 
  required = false,
  options = [],
  placeholder = "",
  rows = 3,
  ...props
}) {
  const baseClasses = "block w-full rounded-md border-0 py-2 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white";
  const errorClasses = "ring-red-300 text-red-900 focus:ring-red-500 placeholder:text-red-300";

  return (
    <div className="flex flex-col w-full">
      <label htmlFor={name} className="block text-sm font-medium leading-6 text-slate-900 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1" title="Required">*</span>}
        {!required && <span className="text-slate-400 ml-1 font-normal text-xs">(Optional)</span>}
      </label>
      <div className="relative">
        {type === "textarea" ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            rows={rows}
            className={`${baseClasses} ${error ? errorClasses : ""}`}
            {...props}
          />
        ) : type === "select" ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={`${baseClasses} ${error ? errorClasses : ""}`}
            {...props}
          >
            <option value="">Select an option</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className={`${baseClasses} ${error ? errorClasses : ""}`}
            {...(type === 'date' ? { onClick: (e) => e.target.showPicker && e.target.showPicker() } : {})}
            {...props}
          />
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

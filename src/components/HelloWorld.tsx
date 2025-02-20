interface Props {
  name: string
}

export default function HelloWorld({ name }: Props) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-semibold text-blue-600">
        Hello {name}!
      </h1>
    </div>
  )
}

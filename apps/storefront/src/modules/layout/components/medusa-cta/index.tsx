import { Text } from "@medusajs/ui"

const MedusaCTA = () => {
  return (
    <Text className="flex gap-x-2 txt-compact-small-plus items-center">
      © {new Date().getFullYear()} NATURZEN
    </Text>
  )
}

export default MedusaCTA

import Modal from "@/components/common/modal";
import ShotDetails from "@/components/shots/shot-details";

export default async function RootLevelModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Modal>
      <ShotDetails />
    </Modal>
  );
}

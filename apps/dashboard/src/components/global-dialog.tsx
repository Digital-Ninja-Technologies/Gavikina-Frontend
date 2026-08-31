import { useSelector } from "@tanstack/react-store";
import { ProjectDialog } from "@/modules/projects/components/project-dialog";
import { closeDialog, dialogStore, resetDialog } from "@/store/dialog-store";

export function GlobalDialog() {
	const { isOpen, view, data } = useSelector(dialogStore, (state) => state);

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			closeDialog();
			setTimeout(() => {
				resetDialog();
			}, 300);
		}
	};

	if (!view) return null;

	switch (view) {
		case "PROJECT_FORM":
			return (
				<ProjectDialog
					open={isOpen}
					onOpenChange={handleOpenChange}
					projectId={data?.projectId}
				/>
			);

		default:
			return null;
	}
}

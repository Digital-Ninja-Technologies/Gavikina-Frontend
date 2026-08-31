import { createStore } from "@tanstack/react-store";

export type DialogView = "PROJECT_FORM" | null;

export interface DialogData {
	projectId?: string;
}

interface DialogState {
	isOpen: boolean;
	view: DialogView;
	data?: DialogData | null;
}

export const dialogStore = createStore<DialogState>({
	isOpen: false,
	view: null,
	data: null,
});

export const openDialog = (view: DialogView, data?: DialogData) => {
	dialogStore.setState((state) => ({
		...state,
		isOpen: true,
		view,
		data,
	}));
};

export const closeDialog = () => {
	dialogStore.setState((state) => ({
		...state,
		isOpen: false,
	}));
};

export const resetDialog = () => {
	dialogStore.setState((state) => ({
		...state,
		view: null,
		data: null,
	}));
};

import { getData } from "@/js/Personalization";
import { useMainStore } from "@/stores/main";

export async function initialize () {
  const data = await getData();
  const mainStore = useMainStore();
  mainStore.importData(data);
}

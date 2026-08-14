import CuidaSideBarCollapse from "~icons/cuida/sidebar-collapse-outline";

function SideBar() {
  return (
    <aside className="min-h-svh min-w-60 bg-sidebar-accent px-6 py-4">
      <div className="flex justify-between">
        ZeroUI
        <button className=" p-1 rouneded-sm rounded-sm">
          <CuidaSideBarCollapse className="" />
        </button>
      </div>
    </aside>
  );
}
export default SideBar;

import { documents } from "./Data/Data";
const AdminDocuments = () => {


  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold text-white">
        Documents
      </h1>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

        <div className="space-y-4">

          {documents.map((doc, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-white/5 border border-white/5"
            >
              {doc}
            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default AdminDocuments;
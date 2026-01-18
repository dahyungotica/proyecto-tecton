// src/modules/Admin/CompanyForm.js
export const CompanyForm = ({ data, onSave }) => {
  return (
    <section className="admin-container">
      <h2>Configuración de Empresa</h2>
      <form onSubmit={onSave}>
        <input type="text" placeholder="Nombre" defaultValue={data.name} />
        <textarea placeholder="Descripción">{data.description}</textarea>
        <button type="submit">Actualizar Datos</button>
      </form>
    </section>
  );
};
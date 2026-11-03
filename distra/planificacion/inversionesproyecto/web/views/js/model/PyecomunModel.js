/*
 * Clase modelo para el componente Ahp.
 * @author ammejias
 * fecha de creación 14/05/2015
 * @version 1.0
 */
function DatPyecomun() {
    this.superClass = ViewModel;
    this.superClass({
        fields: [
            {name: "Identificador del proyecto ahp", type: "Number", pk: true, index: "idproyectoahp", notNull: false},
            {name: "Identificador del proyecto", type: "Number", pk: false, index: "idproyecto", notNull: true},
            {name: "Denominación del proyecto ahp", type: "String", pk: false, index: "denominacion", notNull: false},
            {name: "Nativo", type: "Boolean", pk: false, index: "nativo", notNull: true}

        ],
        insUrl: "/prospectiva/index.php/ahp/saveproyectoahp",
        updUrl: "/prospectiva/index.php/ahp/saveproyectoahp",
        delUrl: "/prospectiva/index.php/ahp/eliminarproyectoahp",
        findUrl: "/prospectiva/index.php/ahp/getproyectoahp",
        findByUrl: "/prospectiva/index.php/ahp/getproyectoahp"
    });
};
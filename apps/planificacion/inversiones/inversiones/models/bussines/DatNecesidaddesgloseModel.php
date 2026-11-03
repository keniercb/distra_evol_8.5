<?php
/**
 * DatNecesidaddesgloseModel
 *
 *
 * @ author Drisis Silvia D�az Rodr�guez
 * @ package Planificaci�n
 * @ subpackage Planificaci�n Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 2.0-0
 **/
class DatNecesidaddesgloseModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatNecesidaddesglose $DatNecesidaddesglose)
    {
        $DatNecesidaddesglose->save();

    }

    public function Eliminar(DatNecesidaddesglose $DatNecesidaddesglose)
    {

        $DatNecesidaddesglose->delete();

    }

    public function desglosarIndicador(
        $iddesgloseentidad, $idactividadentidad, $desgloseActividad, $idactividad, $eliminar = true, $idejercicio
    ) {
       
        /*Buscar actividad, dentro de esta sus normas y sus indicadores */
        $normas_actividad = DatNorma::buscarNormas($idactividad, true);
        $conn = Doctrine_Manager :: connection();
        if ($eliminar == true) {
            $query = "DELETE FROM dat_necesidaddesglose WHERE iddesgloseentidad = ?";
            $res = $conn->execute($query, array($iddesgloseentidad));
        }
        $array_nuevas_necesidades = new Doctrine_Collection(Doctrine :: getTable('DatNecesidaddesglose'));
        $cont = 0;
        foreach ($normas_actividad as $norma) {
            $necesidad = $this->calcularNecesidadIndicador(
                $norma['cantplanif'] / $norma['cantbase'], $desgloseActividad
            );
            if ($necesidad > 0) {
                $array_nuevas_necesidades[$cont]->idindicador = $norma['idindicador'];
                $array_nuevas_necesidades[$cont]->iddesgloseentidad = $iddesgloseentidad;
                $array_nuevas_necesidades[$cont]->necesidad = $necesidad;
                $array_nuevas_necesidades[$cont]->idejercicio = $idejercicio;
                $cont++;
           }
        }
        if ($cont > 0) {
           
            $array_nuevas_necesidades->save();
             
        }
       
    }

    public function buscarNecesidadDesglosada($iddesgloseentidad, $idindicador = null)
    {
        $query = new Doctrine_Query();
        if ($idindicador != null) {
            return $query->from('DatNecesidaddesglose nd')
                ->where('nd.iddesgloseentidad = ? AND nd.idindicador = ?', array($iddesgloseentidad, $idindicador))
                ->execute();
        } else {
            return $query->from('DatNecesidaddesglose dnae')
                ->where('nd.iddesgloseentidad = ? ', $iddesgloseentidad)
                ->execute();
        }

    }

    private function calcularNecesidadIndicador($necesidadNorma, $desgloseActividad)
    {
        return $necesidadNorma * $desgloseActividad;
    }

}

//fin clase

?>
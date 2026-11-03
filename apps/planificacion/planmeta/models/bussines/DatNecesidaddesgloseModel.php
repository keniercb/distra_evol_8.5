<?php

/**
 * DatNecesidaddesgloseModel
 *
 *
 * @ author Drisis Silvia Díaz Rodróguez
 * @ package Planificación
 * @ subpackage Planificación Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 2.0-0
 * */
class DatNecesidaddesgloseModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function Insertar(DatNecesidaddesglose $DatNecesidaddesglose) {
        $DatNecesidaddesglose->save();
    }

    public function Eliminar(DatNecesidaddesglose $DatNecesidaddesglose) {

        $DatNecesidaddesglose->delete();
    }

    public function desglosarIndicador(
    $iddesgloseentidad, $desgloseActividad, $idactividad, $idejercicio, $eliminar = true
    ) {

        /* Buscar actividad, dentro de esta sus normas y sus indicadores */
        $normasActividad = DatNorma::buscarNormas($idactividad, true);
        $conn = Doctrine_Manager:: connection();
        if ($eliminar == true) {
            $query = "DELETE FROM dat_necesidaddesglose WHERE iddesgloseentidad = ?";
            $conn->execute($query, array($iddesgloseentidad));
        }
        $arrayNuevasNecesidades = new Doctrine_Collection(
                Doctrine:: getTable('DatNecesidaddesglose')
        );
        $cont = 0;
        foreach ($normasActividad as $norma) {
            $necesidad = $this->calcularNecesidadIndicador(
                    $norma['necesidad'], $desgloseActividad
            );
            if ($necesidad > 0) {
                $arrayNuevasNecesidades[$cont]->idindicador = $norma['idindicador'];
                $arrayNuevasNecesidades[$cont]->iddesgloseentidad = $iddesgloseentidad;
                $arrayNuevasNecesidades[$cont]->necesidad = $necesidad;
                $arrayNuevasNecesidades[$cont]->idejercicio = $idejercicio;
                $cont++;
            }
        }
        if ($cont > 0) {

            $arrayNuevasNecesidades->save();
        }
    }

    public function buscarNecesidadDesglosada($iddesgloseentidad, $idindicador = null
    ) {
        $query = new Doctrine_Query();
        if ($idindicador != null) {
            return $query->from('DatNecesidaddesglose nd')
                            ->where(
                                    'nd.iddesgloseentidad = ? AND nd.idindicador = ?', array($iddesgloseentidad, $idindicador)
                            )
                            ->execute();
        } else {
            return $query->from('DatNecesidaddesglose dnae')
                            ->where('nd.iddesgloseentidad = ? ', $iddesgloseentidad)
                            ->execute();
        }
    }

    private function calcularNecesidadIndicador($necesidadNorma, $desgloseActividad
    ) {
        return $necesidadNorma * $desgloseActividad;
    }

}

//fin clase


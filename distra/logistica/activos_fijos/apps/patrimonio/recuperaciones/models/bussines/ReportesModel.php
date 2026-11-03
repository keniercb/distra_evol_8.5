<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

class ReportesModel extends ZendExt_Model {//Se utiliza esta clase en Distra

    public function ReportesModel() {
        parent::ZendExt_Model();
    }

    public function tipoReporteEspecialidad($denominacionespec, $reporte) {
        $especialidad = $denominacionespec;
        switch ($especialidad) {
            case "constAloj": {
                    if ($reporte == 1)
                        return 39;
                    else if ($reporte == 2)
                        return 40;
                    else if ($reporte == 3)
                        return 41;
                }break;
            case "ingenieria": {
                    if ($reporte == 1)
                        return 42;
                    else if ($reporte == 2)
                        return 43;
                    else if ($reporte == 3)
                        return 44;
                }break;
            case "sistemaEmp": {
                    if ($reporte == 1)
                        return 36;
                    else if ($reporte == 2)
                        return 37;
                    else if ($reporte == 3)
                        return 38;
                }break;
            case "vivienda": {
                    if ($reporte == 1)
                        return 19;
                    else if ($reporte == 2)
                        return 34;
                    else if ($reporte == 3)
                        return 35;
                    else if ($reporte == 4)
                        return 45;
                }
        }
    }

    public function cargaridSistEmpresarial() {
        $conn = Zend_Registry::get('conexion');
        $selectDatos = "select grr.idespecialidad
                          from mod_nomencladores.nom_especialidad esp
                          INNER JOIN mod_logactivofijotangible.conf_espagrupareporte grr on esp.idespecialidad = grr.idespecialidad
                          where grr.denominacioncolumnareporte = 'sistemaEmp'";
        $sistema = $conn->execute($selectDatos)->fetchAll(PDO::FETCH_ASSOC);
        return $sistema[0]['idespecialidad'];
    }
}

?>

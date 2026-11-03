<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/fpdf/font');
include_once($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');

class ResumenausentismoController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();

    }

    function resumenausentismoAction()
    {
        $this->view->idioma = $this->global->Perfil->idioma;
        $this->render();
    }

    function exportarresumenausentismoAction()
    {
        $filters = json_decode(stripslashes($this->_request->getParam('filters')));
        $estructura = $filters[0]->value;
        $fdesde = $filters[1]->value;
        $fhasta = $filters[2]->value;

        $otroformato = false;
        if (!empty($filters[3])) {
            if ($filters[3]->value == 1 || $filters[3]->value == true) {
                $otroformato = true;
            }
        }

        if ($estructura != "" && $fdesde && $fhasta) {
            $fini = explode('-', $fdesde);
            $ff = explode('-', $fhasta);
            $finicio = $fini[0] . '/' . $fini[1] . '/' . substr($fini[2], 0, 2);
            $ffin = $ff[0] . '/' . $ff[1] . '/' . substr($ff[2], 0, 2);

            $grupopredeterminado = NomGrupodescanso::getGrupoPredeterminado();
            if (!empty($grupopredeterminado)) {
                $modelAM = new DatAsistenciamensualModel();
                $result = $modelAM->GetResumenAusentismo($estructura, $finicio, $ffin);

                if ($otroformato == true) {
                    $objModel = new ExportarResumenAusentismoExcelModel();
                    $resumen = $objModel->exportarExcel($result);
                } else {
                    $objModel = new ExportarResumenAusentismoModel();
                    $resumen = $objModel->construirReporte($result);
                }

                echo json_encode('ok');
            }else{
                echo "Debe definir un grupo de trabajo predeterminado para la entidad en Capital Humano/Registro y 
                Control de Asistencia del Personal/Nomencladores/Régimen de trabajo y descanso.";
            }
        }


    }

}
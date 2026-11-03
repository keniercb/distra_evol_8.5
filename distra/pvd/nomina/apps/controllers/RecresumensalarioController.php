<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
require($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');

/**
 * Controlador para configurar los conceptos contables.
 *
 * @author Tte. Frank Rodiguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuración.
 * @category Clase controladora.
 * @uses ConfigconceptoscontablesController
 * @copyright UCID
 * @version 1.0
 */
class RecresumensalarioController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase.
     */
    public function init()
    {
        parent::init();
    }

    /**
     * Acción utilizada para mostrar la vista de configurar los conceptos contabless.
     */
    public function recresumensalarioAction()
    {
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->render();
    }

    /**
     * Acción utilizada para listar las partidas de gastos
     */
    public function resumensalariosAction()
    {
        $identidades = Zend_Json::decode(stripslashes($this->_getParam('identidades')));
        $denominacionesentidades = Zend_Json::decode(stripslashes($this->_getParam('denominacionesentidades')));
        $idtipopagos = Zend_Json::decode(stripslashes($this->_getParam('idtipopagos')));
        $denominacionestipopagos = Zend_Json::decode(stripslashes($this->_getParam('denominacionestipopagos')));
        $idconceptosentidades = Zend_Json::decode(stripslashes($this->_getParam('idconceptosentidades')));
        $fechainicioperiodo = $this->_getParam('fechainicioperiodo');
        $fechafinperiodo = $this->_getParam('fechafinperiodo');
        $campos = $denominacionestipopagos;
        $valores = array();
        $claves = array();
        $elaborarPagos = new DatElaborarPagos();
        foreach ($denominacionesentidades as $claveentidad => $entidad) {
            foreach ($campos as $clavecampo => $campo) {
                $objmetadatos = $this->integrator->metadatos;
                $datos = $elaborarPagos->obtenerSalarioNetoTotalPorNomina($identidades[$claveentidad], $idtipopagos[$clavecampo],
                    $idconceptosentidades[$claveentidad], $fechainicioperiodo, $fechafinperiodo, $objmetadatos);
                $claves['st'][$campo] = $datos['st'];
                $claves['st']['entidad'] = $entidad;
                $claves['stmujeres'][$campo] = $datos['stmujeres'];
                $claves['stmujeres']['entidad'] = $entidad;
                $claves['sthombres'][$campo] = $datos['sthombres'];
                $claves['sthombres']['entidad'] = $entidad;
            }
            $valores['st'][] = $claves['st'];
            $valores['stmujeres'][] = $claves['stmujeres'];
            $valores['sthombres'][] = $claves['sthombres'];
        }//print_r($valores);die;
        $rfinal['st'] = array('campos' => $campos, 'valores' => $valores['st']);
        $rfinal['stmujeres'] = array('campos' => $campos, 'valores' => $valores['stmujeres']);
        $rfinal['sthombres'] = array('campos' => $campos, 'valores' => $valores['sthombres']);
        $rfinal['grafica'] = [
            ['y' => 9, 'nombre' => 'Mujeres', 'color' => '#008000'],
            ['y' => 3, 'nombre' => 'Hombres', 'color' => '#FF0000']
        ];

        echo Zend_Json::encode(array('datos' => $rfinal));
    }


    public function exportarresumensalarialAction()
    {
        $filas = Zend_Json::decode(stripslashes($this->_getParam('filas')));
        $encabezados = Zend_Json::decode(stripslashes($this->_getParam('encabezados')));
        $fechainicioperiodo = $this->_getParam('fechainicioperiodo');
        $fechafinperiodo = $this->_getParam('fechafinperiodo');
        array_shift($encabezados);
        array_shift($encabezados);
        $resultadoFinal = "";
        $nombreArchivo = 'Nombre';
        $titulo = "Resumen salarial (" . $fechainicioperiodo . "-" . $fechafinperiodo . ")";
        $tipo = "excel";
        $extension = '.xls'; /* $tipo = "word";  $extension = '.doc';*/
        $colspan = count($encabezados);
        $resultadoFinal .= '<table border="1">
        <tr >
        <td colspan=' . $colspan . ' bgcolor="80BFFF "  rowspan="2" ><h3><STRONG>' . $titulo . '</strong> </h3></td>
        </tr>
        </table>';

        $resultadoFinal .= " <table border=1 cellspacing=0 width=60%> ";
        for ($index = 0; $index < count($encabezados); $index++) {
            $resultadoFinal .= " <th align=left bgcolor='CCEEFF' style = color:blue><h4><STRONG>$encabezados[$index]</STRONG></h2></th>";
        }
        $resultadoFinal .= " </tr>";
        foreach ($filas as $clave => $fila) {
            array_shift($fila);
            foreach ($fila as $c => $valorfila) {
                $resultadoFinal .= "<td align=left style = color:black>" . utf8_decode($valorfila) . "</td>";
            }
            $resultadoFinal .= "  </tr>";
        }
        header("Content-type: application/vnd.ms-" . $tipo . ";Charset=iso-8859-1");
        //header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-disposition: attachment; filename=" . $nombreArchivo . $extension);
        header("Pragma: no-cache");
        header("Expires: 0");
        $resultadoFinal .= '</table>';
        echo $resultadoFinal;
        exit();
    }
}
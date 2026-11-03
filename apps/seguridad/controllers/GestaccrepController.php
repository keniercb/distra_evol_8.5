<?php

/**
 * Componente para gestionar las acciones y los reportes asociados a estas.
 *
 * @package   seguridad
 * @copyright UCID
 * @author    Equipo de seguridad UCID
 * @version   2.0.0
 */
class GestaccrepController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function gestaccrepAction()
    {
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();

    }

    function cargarsistfuncAction()
    {
        $idnodo = $this->_request->getPost('node');
        $idsistema = $this->_request->getPost('idsistema');
        if ($idnodo == 0) {
            $sistemas = DatSistema::cargarsistema($idnodo);
        } else {
            $sistemas = DatSistema::cargarsistema($idsistema);
        }
        $contador = 0;
        $sistemafunArr = array();
        if ($sistemas->count()) {
            foreach ($sistemas as $valores => $valor) {
                $sistemafunArr[$contador]['id'] = $valor->id . '_' . $idnodo;
                $sistemafunArr[$contador]['idsistema'] = $valor->id;
                $sistemafunArr[$contador]['text'] = $valor->text;
                $contador++;
            }
        }
        $funcionalidad = DatFuncionalidad::cargarfuncionalidades(
            $idsistema, 0, 0
        );
        if ($funcionalidad->getData() != null) {
            foreach ($funcionalidad as $valores => $valor) {
                $sistemafunArr[$contador]['id'] = $valor->id . '_' . $idnodo;
                $sistemafunArr[$contador]['idfuncionalidad'] = $valor->id;
                $sistemafunArr[$contador]['text'] = $valor->text;
                $sistemafunArr[$contador]['leaf'] = true;
                $contador++;
            }
        }
        echo json_encode($sistemafunArr);

        return;
    }

    function cargargridaccionesAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');
        $denominacion = $this->_request->getPost('buscar');
        $datos = array();
        if ($denominacion) {
            $datos = DatRecurso::buscarRecursos(
                $idfuncionalidad, $denominacion, $limit, $start
            );
            $canfilas = DatRecurso::obtenercantRecursosBuscados(
                $idfuncionalidad, $denominacion
            );
        } else {
            $datos = DatRecurso::buscarRecursos(
                $idfuncionalidad, '', $limit, $start
            );
            $canfilas = DatRecurso::obtenercantRecursosBuscados(
                $idfuncionalidad, ''
            );
        }
        echo json_encode(
            array('cantidad_filas' => $canfilas, 'datos' => $datos)
        );
    }

    function cargarreportesAction()
    {
        $direccion = 'Location: http://' . $_SERVER['HTTP_HOST'] . '/' 
            . 'report_generator.php/api/getReportsCatalog';
        echo header($direccion);
    }

    function reportesasociadosarepAction()
    {
        $idaccion = $this->_request->getPost("idaccion");
        $acciones = DatAccionDatReporte::cargaraccionesasociadasrep($idaccion);
        $datos = array('datos' => $acciones);
        echo json_encode($datos);

        return;
    }

    function buscarparametrosAction()
    {
        $idreporte = $this->_request->getPost("idreporte");
        $idreportGtor = 'report_generator.php/api/getReportMeta?id=';
        $direccion = 'Location: http://' . $_SERVER['HTTP_HOST'] . '/' 
            . $idreportGtor . $idreporte;
        echo header($direccion);
    }

    function relacionaraccrepAction()
    {        
        $idaccion = $this->_request->getPost("idaccion");
        $arrayrepaccadd = json_decode(
            stripslashes($this->_request->getPost('reportesAdd'))
        );
        $arrayrepaccelim = json_decode(
            stripslashes($this->_request->getPost('reportesElim'))
        );
        if (count($arrayrepaccadd)) {
            foreach ($arrayrepaccadd as $valoradd) {
                $arrayRepoAccAdd = new DatAccionDatReporte();
                $arrayRepoAccAdd->idaccion = $idaccion;
                $arrayRepoAccAdd->idreporte = $valoradd[0];
                $arrayRepoAccAdd->denominacion = $valoradd[1];
                $arrayobjAdd[] = $arrayRepoAccAdd;
            }
        }
        if (count($arrayrepaccelim)) {
            DatAccionDatReporte::eliminar($idaccion, $arrayrepaccelim);
        }
        if (count($arrayrepaccadd)) {
            $model = new DatAccionDatReporteModel();
            if ($model->insertaraccionreporte($arrayobjAdd)) {

                    $mensaje = 'Los reportes asociados al '
                        . 'recurso han sido actualizados satisfactoriamente.';

                echo json_encode(array('mensaje'=>$mensaje,'bien'=>1));
            }
        } else {

                $mensaje = 'Los reportes asociados al '
                    . 'recurso han sido actualizados satisfactoriamente.';

            echo json_encode(array('mensaje'=>$mensaje,'bien'=>2));
        }
    }

}

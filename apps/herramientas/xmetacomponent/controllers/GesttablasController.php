<?php

/* Clase controladora para la gestión de las Tablas
 *
 * @author Omar Antonio Díaz Peña
 * @version 2.0.0
 * @package Planificación
 * @subpackage Metadatos
 */

class GesttablasController extends ZendExt_Controller_Secure
{

    private $_manager;
    private $_campoModel;
    private $_relationModel;
    private $_cTtablaModel;

    public function init()
    {
        parent::init();
        $this->_manager = new ZendExt_Metadata_Sql_Manager();
        $this->_campoModel = new ZendExt_Metadata_Models_CampoModel();
        $this->_cTtablaModel = new ZendExt_Metadata_Models_TablaModel();
        $this->_relationModel = new ZendExt_Metadata_Models_RelacionModel();
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
    }

    function eliminarrelacionAction()
    {


        $idcampo = $this->_request->getPost('idcdestino');
        //die($idcampo);
        if ($this->_campoModel->eliminarCampo($idcampo)) {
            $this->showMessage(
                'La relación ha sido eliminada satisfactoriamente.'
            );
        }
    }

    public function gesttablasAction()
    {
        $this->render();
    }

    public function eliminartablaAction()
    {
        try {
            $id = $this->_request->getPost('idtabla');
            $this->_cTtablaModel->eliminarTabla($id);

            $this->showMessage(
                'La tabla ha sido eliminada satisfactoriamente.'
            );
        } catch (Exception $e) {
            throw new ZendExt_Exception('XMT004', $e);
        }

    }

    public function adicionarrelacionAction()
    {
        $campoOrigen = $this->_request->getPost('idcorigen');
        $idtablaorigen = $this->_request->getPost('torigen');
        $idtabladestino = $this->_request->getPost('idtdestino');

        $esvisible = $this->_request->getPost('checkboxEsVisible');
        $idtipocompuesto = $this->_request->getPost(
            'idtipocomponentecompuesto'
        );
        $etiqueta = $this->_request->getPost('displayfield');


        //Valido si en efecto puedo crear la relacion solicitada.
        $torigen = Doctrine::getTable('DatTabla')->find($idtablaorigen);
        $corigen = Doctrine::getTable('DatCampo')->find($campoOrigen);
        $tdestino = Doctrine::getTable('DatTabla')->find($idtabladestino);
        if (!$esvisible) {
            $cdestino = $this->_campoModel->adicionarCampo(
                $corigen->denominacion,
                $idtabladestino, 1, 0, 19,
                null, 0, 0, false
            );

            $this->_relationModel->crearRelacion(
                $corigen->idcampo, $cdestino->idcampo, 1, 1
            );
        } else {


            //Adiciono una tabla con el nombre tablaorigen_tabladestino
            $tcName = "dat_" . substr($tdestino->tabla, 4, strlen($tdestino->tabla) - 4) . "_" .
                substr($torigen->tabla, 4, strlen($torigen->tabla) - 4);

            $tablaCreada = $this->_cTtablaModel->adicionarTabla(
                $torigen->esquema, $tcName, $tdestino->arbol
            );
            //Le adicionó los dos campos con el mismo nombre de los
            //ids de las tablas
            $camposdestino = $this->_campoModel->cargarCampos($idtabladestino);
            $cdestino = DatCampo::obtenerLlavePrimaria($tdestino->idtabla);

            $cdestinorigen = $this->_campoModel->adicionarCampo(
                $corigen->denominacion,
                $tablaCreada['idtabla'],
                1, 0, 19, null, 0, 0, false
            );
            $cdestinodestino = $this->_campoModel->adicionarCampo(
                $cdestino->denominacion,
                $tablaCreada['idtabla'],
                1, 0, 19, null, 0, 0, false
            );
            //Creo las relación tablaorigen-tablacreada
            $explode = explode('_', $tcName);
            // print_r($explode);die;
            $fk = implode(
                '_',
                array('fk', $explode[1], $explode[2], $cdestinorigen->idcampo)
            );

            $this->_relationModel->crearRelacion(
                $corigen->idcampo, $cdestinorigen->idcampo, 1, 1, $fk
            );
            //Creo las relación tabladestino-tablacreada
            $fk = implode(
                '_', array("fk", $explode['2'], $explode['1'],
                           $cdestinodestino->idcampo)
            );

            $this->_relationModel->crearRelacion(
                $cdestino->idcampo, $cdestinodestino->idcampo, 1, 1, $fk
            );
            //Creo un DatComponenteCompuesto usando como máster a
            //la tabla origen
            $compcomp = new DatComponenteCompuesto();
            $compcomp->idtablamaster = $tdestino->idtabla;
            $compcomp->idtipocomponentecompuesto = $idtipocompuesto;
            $compcomp->save();
            //Si el tipo de componente es nomencladorCompuesto creo un
            //DatComboCompuesto
            if ($idtipocompuesto == 3) {
                $combocomp = new DatComboCompuesto();
                $combocomp->idcomponentecompuesto
                    = $compcomp->idcomponentecompuesto;
                $combocomp->displayfield = $etiqueta;
                $combocomp->save();
            }
            //Creo un DatSeleccionmultiple usando como tabla compuesta
            //la máster y como detalle la creada.
            $mselect = new DatSeleccionmultiple();
            $mselect->idtablacompuesta = $tablaCreada['idtabla'];
            $mselect->idtabladetalle = $torigen->idtabla;
            $mselect->idcomponentecompuesto = $compcomp->idcomponentecompuesto;
            $mselect->save();
        }
        $this->showMessage(
            'La relaci&oacute;n ha sido adicionada satisfactoriamente.'
        );
    }

    public function adicionartablaAction()
    {
        $esquema = $this->_request->getPost('esquema');
        $tabla = $this->_request->getPost('tabla');
        $arbol = ($this->_request->getPost('arbol') == 'on') ? 1 : 0;
        $alias = $this->_request->getPost('alias');
        $idprefijo = $this->_request->getPost('idprefijo');

        try {
            if ($this->_cTtablaModel->adicionarTabla(
                $esquema, $tabla,
                $arbol, $idprefijo,
                $alias, $this->_request->getParams()
            )
            ) {
                $this->showMessage(
                    'La tabla fue adicionada satisfactoriamente.'
                );
            }
        } catch (ZendExt_Exception $ex) {
            $this->showMessage('La tabla que quiere adicionar ya existe.');
        }
    }

    public function cargaresquemasAction()
    {
        echo json_encode($this->_cTtablaModel->cargaresquemas());
    }

    public function cargarcmbtiposcompuestosAction()
    {
        $tcompuestos = new stdClass();
        $tcompuestos->datos = $this->_cTtablaModel->cargarTiposCompuestos();
        echo json_encode($tcompuestos);
    }

    public function cargartablasAction()
    {
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $query = $this->_request->getPost('query');

        if ($query) {
            $query = '%' . $query . '%';
            $data = $this->_cTtablaModel->buscarEnTablas(
                $query, $limit, $start
            );
        } else {

            $data = $this->_cTtablaModel->cargarTablas($limit, $start);
        }
        echo json_encode($data);
    }

    public function cargarcmbtablasAction()
    {

        $data = $this->_cTtablaModel->cargarcmbTablas();
        echo json_encode($data);
    }

    public function cargarrelacionesAction()
    {
        $data = new stdClass();
        $data->data = $this->_relationModel->cargarRelaciones(
            $this->_request->getPost('idtabla')
        );
        echo json_encode($data);
    }

    public function cargarexpresionesAction()
    {
        $data = new stdClass();
        $data->data = $this->_campoModel->cargarExpresionesRegulares();
        echo json_encode($data);
    }

    public function cargararbolesquemasAction()
    {
        echo json_encode(
            $this->_cTtablaModel->cargarArbolEsquemas(
                $this->_request->getPost('node')
            )
        );
    }

    public function cargartablasnomecladasAction()
    {
        echo json_encode(array('data' => DatTabla::obtenerTablasNomencladas()));
    }

    public function importarTablaAction()
    {
        $esquema = $this->_request->getPost('schema');
        $tabla = $this->_request->getPost('table');

        if ($this->_cTtablaModel->importarTabla($esquema, $tabla)) {
            $this->showMessage(
                'La tabla ha sido importada satisfactoriamente.'
            );
        }
    }

    public function cargarprefijosAction()
    {
        $prefijos = $this->_cTtablaModel->cargarPrefijos();
        echo json_encode(array('data' => $prefijos));
    }

}
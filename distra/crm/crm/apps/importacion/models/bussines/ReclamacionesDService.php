<?php

/**
 * ReclamacionesDService
 *
 * @package    Domain.
 * @subpackage Domain services.
 * @copyright  UCID
 * @version    1.0
 */
class ReclamacionesDService extends ZendExt_Model
{
    private $_reclamacionesRepository, $_gestordocumental, $_estadoDService, $_datosmaestros, $_confcontratacion, $_confreclamacion;
    private $_datindicador;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_contrato = new DatContrato();
        $this->_reclamacionesRepository = new ReclamacionesRepository();
        $this->_gestordocumental = new GestorDocumentalComunicationInterface();
        $this->_datosmaestros = new DatosMaestrosComunicationInterface();
        $this->_estadoDService = new ReclamacionesEstadoDService();
        $this->_confcontratacion = new ConfContratacionModel();
        $this->_confreclamacion = new ConfReclamaciones();
        $this->_datindicador = new DatIndicadorContrato();
    }

    public function getReclamaciones($params)
    {

        $result = $this->_reclamacionesRepository->getReclamaciones($params);
//        print_r($result);die;
        $listReclamaciones = array();
        foreach ($result['datos'] as $value) {
            if (array_key_exists($value, $listReclamaciones)) {
                continue;
            }

            $listReclamaciones[] = $value;
        }
        return array(
            'cant'                => $result['cant'],
            'datos'               => $listReclamaciones,
            'estados_reclamacion' => $this->_estadoDService->getConfiguracionEstados(
                'reclamacion'
            ),
        );
    }

    function getReclamacionesDocs($idespacioTrabajo
    ) {
        $result = [];
        if ($this->existeGestorDocumental() && !empty($idespacioTrabajo)) {

            $result = $this->_gestordocumental->getContenido(
                array('idespaciotrabajo' => $idespacioTrabajo)
            );
        }
        return $result;
    }

    function adicionarReclamacion($params)
    {
        try {

            $params_values = json_decode($params['values']);
//        print_r($params_values);die;
            $reclamacion = new DatReclamaciones();
            $reclamacion->nombre = $params_values->nombre == '' ? null
                : $params_values->nombre;
            $reclamacion->numero = $params_values->numero == '' ? null
                : $params_values->numero;
            $reclamacion->fecha = $params_values->fecha == '' ? null
                : $params_values->fecha;
            $reclamacion->idcliente = $params_values->idcliente == '' ? null
                : $params_values->idcliente;
            $reclamacion->idtiporeclamacion = $params_values->idtiporeclamacion
            == ''
                ? null : $params_values->idtiporeclamacion;
//            $reclamacion->idclienteproveedor = $params['idclienteproveedor'] == '' ? null : $params['idclienteproveedor'];
            $reclamacion->idproveedor = $params_values->idproveedor == '' ? null
                : $params_values->idproveedor;
            $reclamacion->idlinea = $params_values->idlinea == '' ? null
                : $params_values->idlinea;
            $reclamacion->idtipolinea = $params_values->idtipolinea == '' ? null
                : $params_values->idtipolinea;
            $reclamacion->idcontrato = $params_values->idcontrato == '' ? null
                : $params_values->idcontrato;
            $reclamacion->tipo = $params_values->tipo == '' ? null
                : $params_values->tipo;
            $reclamacion->motivo = $params_values->motivo == '' ? null
                : $params_values->motivo;
            $reclamacion->pretension = $params_values->pretension == '' ? null
                : $params_values->pretension;
            $reclamacion->fundamentacionlegal
                = $params_values->fundamentacionlegal
            == '' ? null
                : $params_values->fundamentacionlegal;


            if (count($_FILES) != 0
                && $this->_confreclamacion->getConfig()['activo'] == '1'
            ) {
                $this->updateUploadFilesName($params);
                $saveValues['idespaciotrabajo'] = $this->generateEspacioTrabajo(
                    $params_values
                );
                $this->insertarDocumentos($saveValues['idespaciotrabajo']);
            }



            $reclamacion->idespaciotrabajo = $saveValues['idespaciotrabajo']
            == '' ? null
                : $saveValues['idespaciotrabajo'];
            $reclamacion->save();
//            print_r($reclamacion);die;



            if ($params['productos']) {
                $params_productos = json_decode($params['productos']);
                $this->adicionarProducto(
                    $reclamacion->idreclamacion, $params_productos
                );
            }

            $idreclamacion = $reclamacion->idreclamacion;
            if ($idreclamacion) {
                $aqui = $this->_estadoDService->registrarEstadoInicial(
                    $idreclamacion
                );
            }
            return array('success' => true);
        } catch (Exception $e) {
            if ($e->getCode() == 335) {
                return;
            }

            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false);
        }
    }

    public function cargarProductos($params)
    {
        //print_r($params);die;
        try {
            $result = array();
            if ($params['idcontrato']) {
                $result['productos'] = $this->_datindicador->getByParams(
                    $params
                );

                if (isset($params['accion'])) {
                    $result['cantidad'] = count($result['productos']);
                    $result['success'] = true;
                    return $result;
                }

                $filter[0] = array(array('field' => 'idcontrato',
                                         'data'  => array('type'       => 'numeric',
                                                          'value'      => $params['idcontrato'],
                                                          'comparison' => 'eq')));


            }
            return $result;
        } catch (Doctrine_Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false);
        }
    }


    public function cargarProductosReclamaciones($params)
    {
        try {
//            print_r($params);die;
            $result = array();
            if ($params['idreclamacion']) {
                $conn = Doctrine_Manager::getInstance()->getCurrentConnection();

                $query
                    = "  SELECT idindicadorreclamacion, idreclamacion, idindicadorcontrato, cantidad, 
                                     denominacion, codigo, idcontrato
                         FROM mod_crmcontratacion.dat_indicadorreclamacion
                               where idreclamacion={$params['idreclamacion']}";
                $result['productos'] = $conn->fetchAll($query);
                $result['cantidad'] = count($result['productos']);
                $result['success'] = true;
                return $result;
            } else {
                $result['productos'] = [];
                $result['cantidad'] = 0;
                $result['success'] = true;
            }
            return $result;
        } catch (Doctrine_Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false);
        }
    }

    public
    function modificarReclamacion($params
    ) {
        try {
            $params_values = json_decode($params['values']);

            $reclamacion = Doctrine::getTable('DatReclamaciones')->find(
                $params_values->idreclamacion
            );
            $reclamacion->nombre = $params_values->nombre == '' ? null
                : $params_values->nombre;
            $reclamacion->numero = $params_values->numero == '' ? null
                : $params_values->numero;
            $reclamacion->fecha = $params_values->fecha == '' ? null
                : $params_values->fecha;
            $reclamacion->idcliente = $params_values->idcliente == '' ? null
                : $params_values->idcliente;
            $reclamacion->idtiporeclamacion = $params_values->idtiporeclamacion
            == ''
                ? null : $params_values->idtiporeclamacion;
//            $reclamacion->idclienteproveedor = $params['idclienteproveedor'] == '' ? null : $params['idclienteproveedor'];
            $reclamacion->idproveedor = $params_values->idproveedor == '' ? null
                : $params_values->idproveedor;
            $reclamacion->idlinea = $params_values->idlinea == '' ? null
                : $params_values->idlinea;
            $reclamacion->idtipolinea = $params_values->idtipolinea == '' ? null
                : $params_values->idtipolinea;
            $reclamacion->idcontrato = $params_values->idcontrato == '' ? null
                : $params_values->idcontrato;
            $reclamacion->motivo = $params_values->motivo == '' ? null
                : $params_values->motivo;
            $reclamacion->pretension = $params_values->pretension == '' ? null
                : $params_values->pretension;
            $reclamacion->fundamentacionlegal
                = $params_values->fundamentacionlegal
            == '' ? null
                : $params_values->fundamentacionlegal;
            $reclamacion->tipo = $params_values->tipo == '' ? null
                : $params_values->tipo;

//            $reclamacion->save();

            if (count($_FILES) != 0) {
                print('/*entro*/');
                $this->updateUploadFilesName($params);
                $saveValues['idespaciotrabajo'] = $this->generateEspacioTrabajo(
                    $params_values
                );
                $this->insertarDocumentos($saveValues['idespaciotrabajo']);

            }
            $reclamacion->idespaciotrabajo = $saveValues['idespaciotrabajo']
            == '' ? $params_values->idespaciotrabajo
                : $saveValues['idespaciotrabajo'];

            $reclamacion->save();


            if ($params['productos']) {
                $params_productos = json_decode($params['productos']);
                $this->adicionarProducto(
                    $reclamacion->idreclamacion, $params_productos
                );
            }

            return array('success' => true);
        } catch (Exception $e) {
            if ($e->getCode() == 335) {
                return;
            }
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false);
        }
    }

    public
    function eliminarReclamacion($reclamaciones
    ) {
//        $query = Doctrine_Query::create();
//        $query->delete()->from('DatReclamaciones')
//            ->whereIn('idreclamacion', $array)
//            ->execute();
////        $this->_reclamacionesRepository->deleteRecords($ids);
        $upEx = array();
//        try {
        $objDoctrine = Doctrine_Manager::getInstance();
//        print_r($reclamaciones);die;
        $conexionActual = $objDoctrine->getCurrentConnection();
        foreach ($reclamaciones as $del) {
            $query
                = "DELETE FROM mod_crmcontratacion.dat_reclamaciones ";
            $query .= " WHERE idreclamacion = " . $del;
            $query .= " RETURNING idreclamacion ";

            $ex = $conexionActual->fetchAll($query);
            if (!$ex) {
                $upEx[] = $del;
            }
        }
//        }catch(Doctrine_Exception $e){
//            $upEx[] = $del->nombre;
//    //                $upEx[] = array(nombre=>$del->nombre, mensaje=>$e->getMessage());
//        }
        if (empty($upEx)) {
            return array('success' => true);
        }
        return array('success' => false, $upEx);
    }

    private
    function adicionarProducto($idreclamacion, $prod
    ) {
        try {
            foreach ($prod->nuevos as $n) {
                $producto = $n->idindicadorreclamacion
                    ?
                    Doctrine::getTable('DatIndicadorReclamacion')->find(
                        $n->idindicadorreclamacion
                    )
                    :
                    new DatIndicadorReclamacion();

                $producto->idreclamacion = $idreclamacion;
                $producto->idindicadorcontrato = $n->idindicadorcontrato
                    ? $n->idindicadorcontrato
                    : null;
                $producto->idcontrato = $n->idcontrato ? $n->idcontrato
                    : null;
                $producto->denominacion = $n->denominacion;
                $producto->codigo = $n->codigo;
                $producto->cantidad = $n->cantidad;

                $producto->save();


                //print_r($producto);die;
            }
            if ($prod->eliminados) {
                $query = Doctrine_Query::create();
                $query->delete()->from('DatIndicadorReclamacion')
                    ->whereIn('idindicadorreclamacion', $prod->eliminados)
                    ->execute();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    private
    function updateUploadFilesName($params
    ) {
        foreach ($_FILES as $k => $file) {
            $id = explode("_new", $k)[1];
            if ($_FILES[$k]['name']) {
                $_FILES[$k]['realname'] = $params['params']["nombre_new" . $id];
            } else {
                unset($_FILES[$k]);
            }
        }
    }

    private
    function generateEspacioTrabajo($params
    ) {
        if ($this->existeGestorDocumental()) {
            $result = $this->_confcontratacion->loadConfReclamacion();
            if (count($result['config'])) {
                $idespacioGeneral = $result['config']['idespaciotrabajo'];
            }

            if ($idespacioGeneral) {
                return $this->_estadoDService->crearEspacioReclamaciones(
                    $params, $idespacioGeneral
                );
            }

            return '';
        }
    }

    public
    function existeGestorDocumental()
    {
        try {
            $conf = new ConfContratacionModel();
            $result = $conf->loadconfreclamaciones();
//            print_r($result);die;
            if (count($result) && count($result['config'])
                && $result['config']['activo']
                && $this->_gestordocumental->testGD()
            ) {
                return true;
            }
            return false;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public
    function insertarDocumentos($idespacioreclamacion
    ) {
        try {
            if (count($_FILES) != 0 && $idespacioreclamacion) {


                $documento = $this->_gestordocumental->saveDocument(
                    $idespacioreclamacion
                );
                if (count($documento) == 0) {
                    throw new Exception(
                        'Ocurrio un error al salvar el documento.', 335
                    );
                }
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public
    function modificarDocumentos($docs
    ) {
        try {
            foreach ($docs as $doc) {
                $this->_gestordocumental->editDocument(
                    $doc->idnodo, array('nombre' => $doc->nombre)
                );
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    function eliminarDocumentos($docs
    ) {
        try {
            if (count($docs)) {
                $this->_gestordocumental->delFile($docs);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    function cargarLineas($params)
    {
        $result = array();

        if (!$params['idnaturaleza']) {
            $params['idnaturaleza'] = $this->cargarNaturaleza();
        }
        if ($params['idnaturaleza']) {
            $result = $this->integrator->logistica->getIndicadoresByParams(
                array('idnaturaleza' => $params['idnaturaleza'], 'nivel' => 2),
                0, 0
            );
        }
        return $result;
    }

    function obtenerTiposLineas($post)
    {
//        return $this->integrator->crm->obtenerTiposLineas($post);
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $where = '';
        $arrwhere = [];
        foreach ($post as $index => $value) {
            if ($index == 'idindicador') {
                $arrwhere[] = " tl.lineas::text like '%" . $value . "%' ";
            }
        }
        if (count($arrwhere) > 0) {
            $where = ' WHERE ' . implode(' AND ', $arrwhere);
        }
        $resp = $conexionActual->fetchAll(
            'SELECT tl.*, tl.denominacion as tipolinea FROM mod_crmcontratacion.nom_tipolinea tl '
            . $where
        );
        $cant = $conexionActual->fetchAll(
            'SELECT count(tl.idtipolinea) FROM mod_crmcontratacion.nom_tipolinea tl '
            . $where
        );
        return array('datos' => $resp, 'total' => $cant[0]['count']);
    }

    function cargarNaturaleza()
    {
        $resultado = '';
        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection(
        );
        $naturaleza = $conexionActual->fetchAll(
            "SELECT n.idnaturaleza FROM mod_datosmaestros.nom_naturaleza n
                      WHERE n.denominacion='Partes y piezas SASA'"
        );
        if ($naturaleza) {
            $resultado = $naturaleza[0]['idnaturaleza'];
        }
        return $resultado;
    }

    function generarConsecutivoAño()
    {
        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection(
        );

        $result = $conexionActual->fetchAll(
            "SELECT count(r.idreclamacion) FROM mod_crmcontratacion.dat_reclamaciones r
            WHERE r.numero LIKE '%." . date('Y') . "'"
        );
        $consecutivo = ((string)1);
        if ($result[0]['count'] != 0) {
            $consecutivo = ((string)$result[0]['count'] + 1);
        }
        $completando = str_pad($consecutivo, 4, '0', STR_PAD_LEFT);
        $result = $completando . '.' . date('Y');
        return $result;
    }

    function obtenerTipoReclamaciones()
    {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $arrwhere = [];
        $resp = $conexionActual->fetchAll(
            'SELECT tr.* FROM mod_crmcontratacion.nom_tiporeclamacion tr '
        );
        $cant = $conexionActual->fetchAll(
            'SELECT count(tr.idtiporeclamacion) FROM mod_crmcontratacion.nom_tiporeclamacion tr '
        );
        return array('datos' => $resp, 'total' => $cant[0]['count']);
    }

    public
    function cargarContratos($params
    ) {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $and = '';
        $JOIN = '';
//        print_r($params);die;
        if ($params['idproveedor']) {
            $and = ' AND c.idclienteproveedor = ' . $params['idproveedor'];
        }
        if ($params['idindicador']) {
            $JOIN
                = " LEFT JOIN mod_crmcontratacion.dat_contratoimportacion ci on (ci.idcontrato= c.idcontrato) ";
            $and2 = ' AND ci.idlinea = ' . $params['idindicador'];
        }

        $query
            = "SELECT (c.numerocontrato||' - '||c.nombre) as nombre, c.idcontrato
                       FROM mod_crmcontratacion.dat_contrato c
                       $JOIN
                       WHERE c.cliente = 2 AND(c.cumplimientoobligaciones=1 OR 
                                    c.fechafirma <='" . date('d/m/Y')
            . "' AND (c.fechafin>='" . date('d/m/Y')
            . "' OR c.fechafin ISNULL ))" . $and . $and2;

        //   print_r($query);die;

        $resp = $conexionActual->fetchAll(
            $query
        );
        return array('datos' => $resp, 'total' => count($resp));
    }
}























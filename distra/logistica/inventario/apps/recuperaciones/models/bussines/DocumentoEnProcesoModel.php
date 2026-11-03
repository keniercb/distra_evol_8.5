<?php
/**
 * Esta clase gestiona el acceso a datos de los documentos en proceso
 * @copyright XETID
 * @author Divicion de Gestion de Entidades
 * @version 1.0
 */
class DocumentoEnProcesoModel extends RecuperacionesInventarioModel
{
    private $docModel;
    private $serviciosConfiguracion;

    public function __construct()
    {
        parent::__construct();
        $this->docModel = new DocumentoLogisticaModel(array('noexception' => true));
        $this->serviciosConfiguracion = ServiciosConfiguracionGeneralHelper::__init();
    }
    /**
     * Funcion que permite obtener los documentos en proceso.
     * @params $params (arreglo de parametros a filtrar)
     * @author Daniel Arias Espinosa
     * @return array
     */
    public function getDocumentos($params = array())
    {
        $params['idestructura'] = Zend_Json::decode($params['idestructura']);
        $params['porsubsistema'] = empty($params['iddoc'])? false : true;
        $params['subsistema'] = LogisticaGlobal::SUBSISTEMA_INV;
        $params['estado'] = empty($params['estado'])? 'null' : '{'.implode(',',$params['estado']).'}';

        $params['criterio'] = empty($params['criterio'])? 'null' : "'{$params['criterio']}'";
        $params['idusuario'] = empty($params['idusuario'])? 'null' : $params['idusuario'];
        $params['desde'] = empty($params['desde'])? 'null' : "'{$params['desde']}'";
        $params['hasta'] = empty($params['hasta'])? 'null' : "'{$params['hasta']}'";
        $params['iddoc'] = empty($params['iddoc'])? 'null' : $params['iddoc'];

        if(empty($params['idestructura'])){
          $datos = $this->loadDepositos()['datos'];
          $params['idestructura'] = LogisticaObjectHelper::__init()->extractValueFromArrayColumn($datos, 'iddeposito');
            array_push($params['idestructura'],$this->global->Estructura->idestructura);
            $idestructuraop = '{'.implode(',',$params['idestructura']).'}';
        } else {
            if(is_array($params['idestructura'])){
                $idestructuraop = '{'.implode(',',$params['idestructura']).'}';
            }else{
                $idestructuraop = '{'.implode(',',array($params['idestructura'])).'}';
            }
        }
        $sql = "select * from mod_loginventario.f_recdocproceso ('{$idestructuraop}','{$params['estado']}',{$params['criterio']},
{$params['idusuario']},{$params['desde']},{$params['hasta']},{$params['iddoc']},{$this->global->Estructura->idestructura},{$params['subsistema']})";
        $conn = Zend_Registry::get('conexion');
        return array(
            'cantidad' => $conn->execute($sql)->rowCount(),
            'datos' => $conn->execute($sql . " limit {$params['limit']} offset {$params['start']}")->fetchAll(PDO::FETCH_ASSOC)
        );
    }

    /**
     * Funcion que permite obtener usuarios asociados al los documentos.
     * @author División de Gestión de Entidades
     * @return array
     */
    public function cargaInicial()
    {
        $usuario = $this->docModel->cargaInicial();
        return $usuario;
    }

}
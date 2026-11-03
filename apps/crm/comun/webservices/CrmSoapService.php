<?php

/**
 * Class CrmSoapService
 * Implementa los servicios soap del subistema CRM
 *
 * @author Alberto Mesa Martinez
 */
define('APP_HOME', realpath(dirname(__FILE__)) . '/');
class CrmSoapService  extends ZendExt_Model
{
    private $_contratomodel;
    private $_idestructura;
    private $_idtipocontrato;
    private $_idpersona;
    private $_idarea;
    private $_idsector;

    function __construct()
    {
        $this->_idestructura = 200530261;
        $this->_idtipocontrato = 3;
        $this->_idpersona = 4;
        $this->_idarea = 200530285;
        $this->_idsector = 13;
        $this->_idestructuracomun = $this->global->Estructura->idestructura;
        // $file = APP_HOME . '../recursos/server_config.ini';
        // if (file_exists($file)) {
        //     $config = parse_ini_file($file, true);
        //     $temp = $config['contratos']['increment_sign'];
        //     $this->_increment_sign = $temp ? ($temp == 'true' ? true : false) : false;
        //     $this->_mostrar_suplementos = ($config['contratos']['mostrar_todos'] ?
        //         ($config['contratos']['mostrar_todos'] == 'true' ? true : false) : false);
        //     $this->_manual_number = ($config['contratos']['numero_manual'] ?
        //         ($config['contratos']['numero_manual'] == 'true' ? true : false) : false);
        //     $this->_mostrar_hitos_area = $config['contratos']['mostrar_hitos_areas'] ?
        //         ($config['contratos']['mostrar_hitos_areas']== 'true'?true:false): false;
        //     $this->_mostrar_todas_areas=$config['areas']['mostrar_todas']?
        //         ($config['areas']['mostrar_todas']== 'true'?true:false): false;
        //     $this->_cliente_tipocontrato=$config['contratos']['cliente_tipocontrato']?
        //         ($config['contratos']['cliente_tipocontrato']== 'true'?true:false): false;
        //     $this->_show_by_resource=$config['contratos']['show_by_resource']?
        //         ($config['contratos']['show_by_resource']== 'true'?true:false): false;
        // }
        $instance = (new ConfContratoGeneral())->getConfig();           
        $config = (array)json_decode($instance['confgcontrato']);
        if ($config) {
            // $config = parse_ini_file($file, true);
            $this->_increment_sign = $config['increment_sign'] && $config['increment_sign'] == 'true';
            $this->_mostrar_hitos_area = $config['mostrar_hitos_areas'] && $config['mostrar_hitos_areas'] == 'true';
            $this->_mostrar_suplementos = ($config['mostrar_todos'] && $config['mostrar_todos'] == 'true');
            $this->_manual_number = ($config['numero_manual'] && $config['numero_manual'] == 'true');
            $this->_mostrar_todas_areas = $config['mostrar_todas_area'] && $config['mostrar_todas_area'] == 'true';
            $this->_cliente_tipocontrato = $config['cliente_tipocontrato'] && $config['cliente_tipocontrato'] == 'true';
            $this->_mostrar_filtro_area = $config['mostrar_filtro_area'] && $config['mostrar_filtro_area'] == 'true';
          //  $this->_show_by_resource = $config['show_by_resource'] && $config['show_by_resource'] == 'true';
            $this->_estructura_persona_nomencladores = $config['estructura_persona_nomenclador'] && $config['estructura_persona_nomenclador'] == 'true';
           
        }  
    }

    public function obtenerEspacioTrabajoContratos($idestructura)
    {
        $confcontratacion = new ConfContratacionModel();
        $resultado = $confcontratacion->loadContractdoc($idestructura);
        return json_encode($resultado);
    }

    public function verificarUsuario($user, $pass, & $info_usuario)
    {
        $passs = md5($pass);
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $sql = "SELECT su.idusuario, su.nombreusuario, su.iddominio
          FROM mod_seguridad.seg_usuario su
      WHERE su.nombreusuario = '$user' AND su.contrasenna = '$passs' AND su.activo = true;";
        $info_usuario = $conn->fetchAll($sql);
        if ($info_usuario[0]['nombreusuario'] == $user) {
            return true;
        } else {
            return false;
        }

    }


    /**
    Metodo para verificar credenciales
     **/

    public function autenticarUsuario($contenido)
    {
        $info=json_decode($contenido);
        $user=$info->user;
        $pass=$info->pass;
        $autenticado=0;
        $info_usuario=array();
        if(self::verificarUsuario($user, $pass,$info_usuario)){
            $autenticado=1;
        }
        return json_encode(array('autenticado' => $autenticado, 'nombreusuario'=>$info_usuario[0]['nombreusuario'],
            'idusuario' => $info_usuario[0]['idusuario'],
            'iddominio' => $info_usuario[0]['iddominio']
        ));
    }

    public function cargarContratos($contenido)
    {
        $info=json_decode($contenido);

        $iddominio = $info->iddominio;

        $filter="";
        if($info->filter_numero!="")
            $filter.=" AND c.numero ilike '%".$info->filter_numero."%'";

        $sql = " SELECT COALESCE(c.idcontrato::varchar, '') as idcontrato,
                   COALESCE(c.numero::varchar, '') as numero,
                   COALESCE(c.numerocontrato::varchar, '') as numerocontrato,
                   COALESCE(c.nombre::varchar, '') as nombre,
                   COALESCE(c.montototal::varchar, '') as montototal,
                   COALESCE(TO_CHAR(c.fechafirma :: DATE, 'dd/mm/YYYY')::varchar, '') as fechafirma,
                   COALESCE(TO_CHAR(c.fechainicio :: DATE, 'dd/mm/YYYY')::varchar, '') as fechainicio,
                   COALESCE(TO_CHAR(c.fechainicio :: DATE, 'yyyy-mm-dd')::varchar, '') as finicio,
                   COALESCE(TO_CHAR(c.fechafin :: DATE, 'dd/mm/YYYY')::varchar, '') as fechafin,
                   COALESCE(TO_CHAR(c.fechafin :: DATE, 'yyyy-mm-dd')::varchar, '') as ffin, 
                   COALESCE(e.nombre::varchar, '') as denestado, 
                   COALESCE(s.denominacion::varchar, '') as densector,
                   CASE WHEN c.cliente is null THEN '' ELSE c.cliente::varchar END as cliente
                  FROM mod_crmcontratacion.dat_contrato c
                  LEFT JOIN mod_crmcontratacion.dat_contratoestado ce
                  ON c.idcontrato=ce.idcontrato AND ce.fechafin is NULL   
                  LEFT JOIN mod_crmcontratacion.nom_estado e
                  ON ce.idestado=e.idestado
                  LEFT JOIN mod_crmcontratacion.nom_sector s
                  ON c.idsector=s.idsector
                  LEFT JOIN mod_estructuracomp.nom_filaestruc nfe 
                  ON c.idarea = nfe.idfila
                  WHERE nfe.dominiofila[$iddominio] = 1::bit 
                    $filter
                  ";

        $where="";
        if(isset($info->param_numerocontrato)){
          $where.="  AND upper(c.numerocontrato) like '%".strtoupper($info->param_numerocontrato)."%' ";
        }

        $sql.=$where;


        $conn1 = Doctrine_Manager:: connection();
        $resnopag = $conn1->execute($sql);
        $resultnopag = $resnopag->fetchAll(PDO::FETCH_ASSOC);
        $total = count($resultnopag);


        $sql.=" ORDER BY c.fechainicio DESC, c.numero DESC LIMIT 20";


        $conn2 = Doctrine_Manager:: connection();
        $res = $conn2->execute($sql);
        $info_contratos = $res->fetchAll(PDO::FETCH_ASSOC);

        //$info_contratos=array_slice($info_contratos, $inicio, $limite);

        $respuesta=[];
        foreach ($info_contratos as $key => $contrato){
          $respuesta[$key]['idcontrato']=str_replace(" ","",$contrato['idcontrato']);
          $respuesta[$key]['numero']=str_replace(" ","",$contrato['numero']);
          $respuesta[$key]['numerocontrato']=str_replace(" ","",$contrato['numerocontrato']);
          $respuesta[$key]['nombre']=$contrato['nombre'];
          $respuesta[$key]['montototal']=str_replace(" ","",$contrato['montototal']);
          $respuesta[$key]['fechafirma']=str_replace(" ","",$contrato['fechafirma']);
          $respuesta[$key]['fechainicio']=str_replace(" ","",$contrato['fechainicio']);
          $respuesta[$key]['finicio']=str_replace(" ","",$contrato['finicio']);
          $respuesta[$key]['fechafin']=str_replace(" ","",$contrato['fechafin']);
          $respuesta[$key]['ffin']=str_replace(" ","",$contrato['ffin']);
          $respuesta[$key]['denestado']=str_replace(" ","",$contrato['denestado']);
          $respuesta[$key]['densector']=str_replace(" ","",$contrato['densector']);
          $respuesta[$key]['cliente']=str_replace(" ","",$contrato['cliente']);
        }

        return json_encode(
            array('success' => 'true', 'cantidad_total' => $total, 'contratos' =>$respuesta)
        );

    }

    public function crearContrato($parametros)
    {
        try {
            $this->setAttributes($parametros);
            $contrato = new GestioncontratoModel();
            if (is_object($parametros)) {
                $parametros = (array)$parametros;
            }
            $tipocontrato = $this->obtenerDatosTipoContrato($this->_idsector)['data'][0];

            $parametros['idtipocontrato'] = 3;
            $parametros['idestructura'] = $this->_idestructura;
            $parametros['idespaciotrabajo']
                = $parametros['idespaciotrabajocontrato'];
            $parametros['idarea'] = $this->_idarea;
            $parametros['tipocontrato'] = $tipocontrato['denominacion'];
            $parametros['idpersona'] = 4;
            $parametros['numeroparametros'] = json_encode(
                array("cliente"         => 1,
                      "marco"           => null,
                      "especifico"      => 0,
                      "idarea"          => $this->_idarea,
                      "idestructura"    => $this->_idestructura,
                      "idcontratomarco" => null)
            );
            $parametros['cumplimientoobligaciones'] = 1;
            $parametros['vigencia'] = null;
            $parametros['unidadtiempo'] = null;
            if(!$parametros['montototal']){
                $parametros['montototal'] = 0;
            }
            $resultado = $contrato->saveContrato($parametros);
            return $resultado;
        } catch (Exception $e) {
            return json_encode(
                array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                      'success' => false)
            );
        }
    }

    public function crearOferta($parametros)
    {
        try {
            $this->setAttributes($parametros);
            $ofertanegociodservice = new OfertaNegocioDService();
            if (is_object($parametros)) {
                $parametros = (array)$parametros;
            }

            $cliente = $this->obtenerDatosClienteProveedor(
                $parametros['idclienteproveedor']
            );

            if ($cliente) {
                $parametros['idclienteproveedor']
                    = $cliente['idclientesproveedores'];
                $parametros['nombre']
                    = 'Solicitud del cliente ' . $cliente['nombre']
                    . ' creada con fecha ' . date('d-m-Y');
                $parametros['idarea'] = 200530285;
                $idsolicitud = $this->crearSolicitud($parametros);
            } else {
                throw new Exception('No existe el cliente.', -7);
            }

            $parametros['idsolicitud'] = $idsolicitud;
            $parametros['idespaciotrabajo']
                = $parametros['idespaciotrabajooferta'];
            $parametros['nombre']
                = 'Oferta para el cliente ' . $cliente['nombre']
                . ' creada con fecha ' . date('d-m-Y');
            $parametros['vigencia'] = 1;
            $parametros['unidadtiempo'] = 2;
            $parametros['idsector'] = $this->_idsector;/*
            if(!$parametros['montototal']){
                $parametros['montototal'] = 0;
            }*/

            $resultado = $ofertanegociodservice->adicionarOferta($parametros);

            $parametros['clienteproveedor'] = $cliente['nombre'];
            $parametros['nombre'] = 'contrato del cliente ' . $cliente['nombre']
                . ' creada con fecha ' . date('d-m-Y');
            $resultado = $this->crearContrato($parametros);

            Doctrine_Manager::getInstance()->getCurrentConnection()->commit();

            return json_encode(array('code' => 1, 'success' => true));
        } catch (Exception $e) {
            return json_encode(
                array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                      'success' => false)
            );
        }
    }

    private function crearSolicitud($parametros)
    {
        $ofertanegociodservice = new SolicitudNegocioDService();
        if (is_object($parametros)) {
            $parametros = (array)$parametros;
        }

        $idsolicitud = $ofertanegociodservice->adicionarSolicitud($parametros);
        return $idsolicitud;
    }

    private function obtenerDatosClienteProveedor($idclienteproveedor)
    {
        $datosmaestros = new DatosMaestrosComunicationInterface();
        $result = $datosmaestros->getClienteById($idclienteproveedor);
        if ($result['cantidad'] != 0) {
            return $result['datos'][0];
        }
        return array();
    }

    private function obtenerDatosTipoContrato($idtipocontrato)
    {
        $tipocontrato = new DatTipoContrato();
        $filtro = array(
            array('data' => array('type'  => 'numeric',
                                  'value' => $idtipocontrato),
                  'field' => 'idtipocontrato'),
            array('data'  => array('type' => 'numeric', 'value' => 200530196),
                  'field' => 'idestructuracomun'),
        );
        return $tipocontrato->getModelData(array(0 => 0, 1 => 1, 4 => $filtro));
    }

    public function obtenerContratos($parametros)
    {

        $contrato = new DatContrato(/*array('conexion' => $conexion)*/);
        if (is_object($parametros)) {
            $parametros = (array)$parametros;
        }
        $filtros = $this->obtenerFiltros($parametros);
//        return $filtros;
        $model=new GestioncontratoModel();
//        $result = $model->getContratos(array('filter'=>$filtros, 'start'=>0, 'limit'=>2), false, false);
        $result = $contrato->cargarcontrato(array($filtros, ' AND '), null, null,
            $parametros['limit']?$parametros['limit']:20, 0, $parametros['idestructura']?$parametros['idestructura']:null);
        $data=[];
        foreach($result['data'] as $r){
            $data[]=array(
                'idcontrato'=>$r['idcontrato'],
                'nombre'=>$r['nombre'],
//                'numero'=>$r['numero'],
                'numerocontrato'=>$r['numerocontrato'],
//                'clienteproveedor'=>$r['clienteproveedor'],
                'estado'=>$r['estadoinicial'],
                'fechafirma'=>$r['fechafirma'],
//                'nombrearea'=>$r['nombrearea'],
                'idespaciotrabajo'=>$r['idespaciotrabajo']
            );
        }
//        return $result;
//        return $this->global->Estructura->idestructura;
//        return $result['query'];
        return json_encode(array('success'=>true, 'cant'=>$result['cant'], 'data'=>$data));
    }

    private function obtenerFiltros($parametros)
    {
        $columnas = Doctrine::getTable('DatContrato')->getColumns();
//        $filtros = array();
        $filtros = Array (
//            0 =>Array ( 'field' => 'dominiofila', 'data' => Array ( 'type' => 'bit', 'value' => 1 ) ),
            array('field' => 'dominiofila', 'data'  => array('type'  => 'other', 'value' => 1)),
            array('field' => 'ultimocontrato', 'data'  => array('type'  => 'other', 'value' => !$this->_mostrar_suplementos)),
            array('field' => 'hitosarea', 'data'  => array('type'  => 'other', 'value' => $this->_mostrar_hitos_area)),
            array('field' => 'todasareas', 'data'  => array('type'  => 'other', 'value' => $this->_mostrar_todas_areas))
        );
        foreach ($parametros as $key => $value) {
            if (isset($columnas[$key])) {
                $config = $columnas[$key];
                if ($config['type'] == 'numeric') {
                    $filtros[] = $this->obtenerFiltroNumeric($key, $value);
                }

                if ($config['type'] == 'character varying') {
                    $filtros[] = $this->obtenerFiltroString($key, $value);
                }
            }else{
                if($key=='estado')
                    $filtros[] = array('field' => 'estadoinicial', 'data'  => array('type'  => 'list', 'value' => $value));
            }

        }
        return $filtros;
    }

    public function obtenerDatosContrato($idcontrato)
    {
        $contrato=new DatContrato();
        $result=$contrato->obtenerDatosContrato($idcontrato);
        $datos=null;
        foreach($result as $r){
            $datos=array(
                'nombre'=>$result['nombre'],
                'numero'=>$result['numero'],
                'numerocontrato'=>$result['numerocontrato'],
                'montototal'=>$result['montototal'],
                'denominacionclienteproveedor'=>$result['denominacionclienteproveedor'],
                'sector'=>$result['sector'],
                'denominaciontipocontrato'=>$result['denominaciontipocontrato'],
                'descripcion'=>$result['descripcion'],
                'contratomarco'=>$result['contratomarco']==1?'Contrato marco':'Contrato específico',
                'cliente'=>$result['cliente']==0?'Contrato proveedor':'Contrato cliente',
                'nombrearea'=>$result['nombrearea'],
                'idespaciotrabajo'=>$result['idespaciotrabajo'],
                'fechafirma'=>$result['fechafirma'],
                'fechafin'=>$result['fechafin'],
                'estadoinicial'=>$result['estadoinicial']
            );
        }
        return json_encode($datos);
//        return $idcontrato;
    }

    private function obtenerFiltroNumeric($key, $value)
    {
        if (is_object($value)) {
            $value = (array)$value;
        }
        return array('field' => $key,
                     'data'  => array('type'       => 'numeric',
                                      'comparison' => 'eq', 'value' => $value));
    }

    private function obtenerFiltroString($key, $value)
    {
        return array('field' => $key,
                     'data'  => array('type' => 'string', 'value' => $value));
    }

    private function setAttributes($parametros){
        $this->_idsector = $parametros['idsector'] ? $parametros['idsector'] : $this->_idsector;
        $this->_idtipocontrato = $parametros['idtipocontrato'] ? $parametros['idtipocontrato'] : $this->_idtipocontrato;
        $this->_idpersona = $parametros['idpersona'] ? $parametros['idpersona'] : $this->_idpersona;
        $this->_idarea = $parametros['idarea'] ? $parametros['idarea'] : $this->_idarea;
        $this->__idestructura = $parametros['idestructura'] ? $parametros['idestructura'] : $this->_idestructura;
    }

    public function obtenerTiposContratos($paramentros){
        $this->setAttributes($paramentros);
        $tipocontrato = new DatTipoContrato();
        return $tipocontrato->cargartipocontrato($this->_idestructura);
    }

    public function cargarSolicitudesNegocio($parametros)
    {
        $solicitudnegocio = new SolicitudNegocioRepository();
        if(!$parametros){
            $parametros=array();
        }else if (is_object($parametros)) {
            $parametros = (array)$parametros;
        }
        $params=$parametros;
        $params['filters']=array(
                array('field' => 'cliente', 'data'  => array('value' => '[1,2,4]')),
//                array('field' => 'idsolicitud', 'data'  => array('value' => '370')),
//                array('field' => 'nombre', 'data'  => array('value' => 'solici')),
        );
        foreach($parametros as $key=>$p){
            if($key=='nombre'){
                $params['filters'][]=array('field' => 'nombre', 'data'  => array('value' => $p));
            }
        }
        $data=$solicitudnegocio->getSolicitudesNegocio($params);
        $result=[];
        foreach ($data['datos'] as &$d){
            $result[]=array(
                'idsolicitud'=>str_replace(" ","",$d['idsolicitud']),
                'nombre'=>$d['nombre'],
                'descripcion'=>$d['descripcion'],
                'numero'=>$d['numero'],
                'fechacreada'=>str_replace(" ","",$d['fechacreada']),
                'idestado'=>str_replace(" ","",$d['idestado']),
                'estado'=>$d['estado'],
                'idsector'=>str_replace(" ","",$d['idsector']),
                'sector'=>$d['sector'],
                'idclienteproveedor'=>str_replace(" ","",$d['idclienteproveedor']),
                'clienteproveedor'=>$d['clienteproveedor'],
                'idarearesponsable'=>str_replace(" ","",$d['idarearesponsable']),
                'arearesponsable'=>$d['arearesponsable'],
            );
           /* $d['idsolicitud']=str_replace(" ","",$d['idsolicitud']);
            $d['idclienteproveedor']=str_replace(" ","",$d['idclienteproveedor']);
            $d['idsector']=str_replace(" ","",$d['idsector']);
            $d['idarearesponsable']=str_replace(" ","",$d['idarearesponsable']);
            $d['descripcion']=str_replace(" ","",$d['descripcion']);
            $d['fechacreada']=str_replace(" ","",$d['fechacreada']);
            $d['nombre']=str_replace(" ","",$d['nombre']);
            $d['idespaciotrabajo']=str_replace(" ","",$d['idespaciotrabajo']);
            $d['documento']=str_replace(" ","",$d['documento']);
            $d['cliente']=str_replace(" ","",$d['cliente']);
            $d['idestructuracomun']=str_replace(" ","",$d['idestructuracomun']);
            $d['idlinea']=str_replace(" ","",$d['idlinea']);
            $d['idtipolinea']=str_replace(" ","",$d['idtipolinea']);
            $d['fechafin']=str_replace(" ","",$d['fechafin']);
            $d['idpersona']=str_replace(" ","",$d['idpersona']);
            $d['numero']=str_replace(" ","",$d['numero']);
            $d['idpadre']=str_replace(" ","",$d['idpadre']);
            $d['objeto']=str_replace(" ","",$d['objeto']);
            $d['montototal']=str_replace(" ","",$d['montototal']);
            $d['idarea']=str_replace(" ","",$d['idarea']);
            $d['solicituddemanda']=str_replace(" ","",$d['solicituddemanda']);
            $d['sector']=str_replace(" ","",$d['sector']);
            $d['arearesponsable']=str_replace(" ","",$d['arearesponsable']);
            $d['tipolinea']=str_replace(" ","",$d['tipolinea']);
            $d['linea']=str_replace(" ","",$d['linea']);
            $d['codigolinea']=str_replace(" ","",$d['codigolinea']);
            $d['nombrepersona']=str_replace(" ","",$d['nombrepersona']);
            $d['cantofertas']=str_replace(" ","",$d['cantofertas']);
            $d['desactivada']=str_replace(" ","",$d['desactivada']);
            $d['idestado']=str_replace(" ","",$d['idestado']);
            $d['estado']=str_replace(" ","",$d['estado']);
            $d['estadoicon']=str_replace(" ","",$d['estadoicon']);
            $d['fechaestado']=str_replace(" ","",$d['fechaestado']);
            $d['clienteproveedor']=str_replace(" ","",$d['clienteproveedor']);
            $d['clasificacionclienteproveedor']=str_replace(" ","",$d['clasificacionclienteproveedor']);*/
        }
       return json_encode(array('success'=>true, 'total'=>$data['cant'], 'data'=>$result));
    }

    public function cargarOfertasNegocio($parametros)
    {
        $ofertasnegocio = new OfertaNegocioRepository();
        if(!$parametros){
            $parametros=array();
        }else if (is_object($parametros)) {
            $parametros = (array)$parametros;
        }
        $params=$parametros;
        /*$params['filters']=array(
                array('field' => 'cliente', 'data'  => array('value' => '[1,2,4]')),
//                array('field' => 'idsolicitud', 'data'  => array('value' => '370')),
//                array('field' => 'nombre', 'data'  => array('value' => 'solici')),
        );*/
        foreach($parametros as $key=>$p){
            if($key=='nombre'){
                $params['filters'][]=array('field' => 'nombre', 'data'  => array('value' => $p));
            }
        }
        $data=$ofertasnegocio->getOfertasNegocio($params);
        $result=[];
        foreach ($data['datos'] as &$d){
            $result[]=array(
                'idoferta'=>str_replace(" ","",$d['idoferta']),
                'nombre'=>str_replace(" ","",$d['nombre']),
                'descripcion'=>str_replace(" ","",$d['descripcion']),
                'numero'=>str_replace(" ","",$d['numero']),
                'fechainicio'=>str_replace(" ","",$d['fechainicio']),
                'idestado'=>str_replace(" ","",$d['idestado']),
                'estado'=>str_replace(" ","",$d['estado']),
                'idsector'=>str_replace(" ","",$d['idsector']),
                'sector'=>str_replace(" ","",$d['sector']),
                'idclienteproveedor'=>str_replace(" ","",$d['idclienteproveedor']),
                'clienteproveedor'=>str_replace(" ","",$d['clienteproveedor']),
                'idarearesponsable'=>str_replace(" ","",$d['idarearesponsable']),
                'arearesponsable'=>str_replace(" ","", $d['arearesponsable']),
            );
        }
       return json_encode(array('success'=>true, 'total'=>$data['cantidad'], 'data'=>$data));
    }

//    public function crearClienteProveedor(){
//        $params=array(
//            'nombre'=>'bonifacio',
//            'codigo'=>'987654321',
//            'idtipo'=>'2',
//            'idclasificacion'=>'2',
//            'registrado'=>'0',
//        );
//        $result=$this->integrator->datosmaestros->adicionarClienteProveedor($params);
//        return json_encode($result);
//    }

    public function obtenerClientesProveedores($parametros){
//        return json_encode('ddfdfdf'.$this->_idestructuracomun.'pppp'.$this->global->Estructura->idestructura);
        $params=array(
            'nombre'=>'bonifacio',
            'codigo'=>'987654321',
            'idtipo'=>'2',
            'idclasificacion'=>'2',
            'registrado'=>'0'
        );
//        $result=$this->integrator->datosmaestros->adicionarClienteProveedor($params);
        $result=$this->integrator->datosmaestros->getClientesProveedorByParams(
            null, null, null, null, null, 0, 10
        );
        return json_encode($result);

//        $datosmaestros = new DatosMaestrosComunicationInterface();
//        $result = $datosmaestros->getClientesProveedores($parametros);
////        $respuesta=array('success' => 'true');
////        $respuesta=array_merge($result);
//        return json_encode($result);
    }

}

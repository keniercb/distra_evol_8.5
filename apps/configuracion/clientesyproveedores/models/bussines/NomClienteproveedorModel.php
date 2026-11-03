<?php

/**
 * Class NomClienteproveedorModel
 */
define('APP_HOME', realpath(dirname(__FILE__)) . '/');
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');
class NomClienteproveedorModel extends ZendExt_Model
{

    /**
     * Constructor de la clase
     */
    private $_codigounico;
    public function __construct()
    {
        //comentario
        parent::ZendExt_Model();
        $file = APP_HOME . '../../../comun/datosmaestros_config.ini';
        if (file_exists($file)) {
            $config = parse_ini_file($file, true);
            $this->_codigounico= $config['codigo']['codigo_unico'];


        }

    }

    /**
     * @param      $post
     * @param bool $foto
     * @param null $start
     * @param null $limit
     * @param bool $showall
     *
     * @return array
     */
    public function cargarClientesproveedores($post, $foto = true,
                                              $start = null, $limit = null, $showall = true
    ) {
        try {
//            echo '<pre>';print_r($_SERVER);die;
            $existeGis = $this->existeGis();
            $result = NomClienteproveedor::obtenerClientesproveedores(
                $post, $foto, $start, $limit,$existeGis, $showall
            );
            $validador=$this->Verificarcontabilidad();

            if($validador[0]['activo']==1)
            {
                $result=$this->checkDeudasClientes($result);
            }
            $gestor=$this->VerificarEspacio();

            if($gestor[0]['activo']==1){
                $result['espaciotrabajo'] = $this->obtenerEspacioTrabajoCertifico(
                    $post
                );
            }
//            (new HisTrazaModel())->saveTraza(array('peticion'=>'Cargar cliente', 'cantidad'=>$result['cantidad']));
            return $result;
        } catch (Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                'success' => false);
        }
    }

    public function checkDeudasClientes($result){
        $idclientesproveedores=array();
        foreach ($result['datos'] as $r){
            $idclientesproveedores[]=$r['idclientesproveedores'];
        }
//        print_r($idclientesproveedores);die;

        $validador=$this->Verificarcontabilidad();

        if($validador[0]['activo']==1)
        {

            $datosDeudas=$this->integrator->copa->cargarDatosDuoClientes(array('clientes'=>$idclientesproveedores));
            foreach ($result['datos'] as $i=>$r){
                $cont=0;
                if($r['argumento']==null){
                    foreach($datosDeudas as $d){
                        if ($r['idclientesproveedores'] == $d['idcliente']) {
                            $cont += 1;
                        }
                    }
                }
//            $result['datos'][$i]['deuda']=true;
                $result['datos'][$i]['deuda']=$cont>0;
            }
        }
        else
            $result['datos'][0]['deuda']=0;
        return $result;
    }

    public function checkearDeudas($idestructura){
        try{
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            if(!$idestructura){
                $idestructura=$this->global->Estructura->idestructura;
            }
            $result = $conexionActual->fetchAll(
                "SELECT cpe.idclienteproveedorentidad, cpe.idclienteproveedor, cpe.habilitado, cph.argumento 
                  FROM  mod_datosmaestros.dat_clienteproveedorentidad cpe
                 LEFT JOIN mod_datosmaestros.dat_clienteproveedor_habilitar cph ON(cpe.idclienteproveedorentidad=cph.idclienteproveedorentidad)
                 WHERE cpe.idestructuracomun=".$idestructura);
//            $result = $conexionActual->fetchAll("SELECT cpe.idclienteproveedor FROM mod_datosmaestros.dat_clienteproveedorentidad cpe
//                WHERE cpe.idestructuracomun=".$this->global->Estructura->idestructura);
            $idclientesproveedores=array();
            foreach ($result as $r){
                $idclientesproveedores[]=$r['idclienteproveedor'];
            }
            $datosDeudas=$this->integrator->copa->cargarDatosDuoClientes(array('clientes'=>$idclientesproveedores));
//            print_r(count($result));
//            print_r($idclientesproveedores);
//            print_r($datosDeudas);die;
            foreach ($result as $r){
                $cont=0;
                if($r['argumento']==null){
                    foreach($datosDeudas as $d){
                        if ($r['idclienteproveedor'] == $d['idcliente']) {
                            $cont += 1;
                        }
                    }
                }
                if($r['habilitado']!=($cont>0?0:1)) {
//                    print('/*entro*/');
                    $cliente = Doctrine::getTable('DatClienteProveedorEntidad')->find($r['idclienteproveedorentidad']);
                    if ($cliente) {
                        $cliente->habilitado = $cont > 0 ? 0 : 1;
                        $cliente->save();
                    }
                }
            }
//            foreach($datosDeudas as $d){
//                $cliente=Doctrine::getTable('NomClienteproveedor')->find($r['idcliente']);
//                if($cliente){
//                    $cliente->habilitado=0;
//                    $cliente->save();
//                }
//            }
//            print('/*lo primero*/');die;
            return array('code' => 1, 'success' => true);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }


    public function Verificarcontabilidad(){

        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();

        $idestructura=$this->global->Estructura->idestructura;

        $result = $conexionActual->fetchAll(
            "SELECT activo, idestructuracomun
             FROM mod_crmadministracion.dat_contratocontabilidad cc
             where cc.idestructuracomun=".$idestructura);

        return $result;

    }

    public function VerificarEspacio(){

        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $result = $conexionActual->fetchAll(
            "SELECT activo
             FROM mod_crmadministracion.conf_clientesproveedores
             ");

        return $result;

    }




    public function cargardeudas($idclienteproveedor){
//        return array('datos'=>array(0=>array('denominacion'=>'aaaaaaa')));
        $validador=$this->Verificarcontabilidad();

        if($validador[0]['activo']==1)
        {
            return array('datos'=>$this->integrator->copa->cargarDatosDuoClientes(array('clientes'=>json_decode($idclienteproveedor))));
        }
        else
        {
            return array('datos'=>null);
        }
    }

    public function cargarClientesproveedoresEspaciosTrabajo(){

    }

    /**
     * @param $datos
     * @param $add
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function gestionar($datos, $add){
        try {
            $response = array('code' => -1, 'success' => true);
            $idestructuracomun = $this->global->Estructura->idestructura;
            if ($datos['idestructura']) {
                $idestructuracomun = $datos['idestructura'];
            }
            $exist = false;
            if ($add) {
                $nomClienteproveedor = new NomClienteproveedor();
                //$idestructuracomun = $idEstructura;
            } else {
                $nomClienteproveedor = Doctrine::getTable('NomClienteproveedor')
                    ->find(
                        $datos[1]->idclientesproveedores
                    );
                //$idestructuracomun = $datos[1]->idestructuracomun;
            }

            if($datos[0]->idClasificacion==1){
                $nomClienteproveedor->nombre = $datos[0]->nombre;
            }else{
                $nomClienteproveedor->nombre=$datos[0]->pnombre.' '.$datos[0]->snombre.' '.$datos[0]->papellido.' '.$datos[0]->sapellido;
                $nomClienteproveedor->nombre_json =
                    '{"pn": "'.$datos[0]->pnombre.
                    '","sn": "'.$datos[0]->snombre.
                    '","pa": "'.$datos[0]->papellido.
                    '","sa": "'.$datos[0]->sapellido.'"}';
            }
            $nomClienteproveedor->idtipo = $datos[0]->idtipo;
            $nomClienteproveedor->idclasificacion = $datos[0]->idClasificacion;
            $nomClienteproveedor->registrado = $datos[0]->registrado;
            $nomClienteproveedor->codigo = $datos[0]->codigo;
            $nomClienteproveedor->codigonit = $datos[0]->codigonit;
            $nomClienteproveedor->abreviatura = $datos[0]->abreviatura;
            $nomClienteproveedor->telefono = $datos[0]->telefono;
            $nomClienteproveedor->idorganismo = $datos[0]->idorganismo;
            $nomClienteproveedor->idsector = $datos[0]->idsector;
            $nomClienteproveedor->foto = pg_escape_bytea($datos[0]->foto);
            $nomClienteproveedor->correo = $datos[0]->correo;
            $nomClienteproveedor->idpais = $datos[0]->idpais;
            $nomClienteproveedor->dpa = $datos[0]->dpa;
            $nomClienteproveedor->direccion = $datos[0]->direccion;
            $nomClienteproveedor->descripcion = $datos[0]->descripcion;
            $nomClienteproveedor->idclasificacioncontable
                = $datos[0]->idclasificacioncontable;
            $nomClienteproveedor->credito = $datos[0]->credito;
            $nomClienteproveedor->fechainicio = $datos[0]->fechainicio;
            $nomClienteproveedor->idusuario = $datos[0]->idusuario;
            $nomClienteproveedor->idpadre = $datos[0]->idpadre;
            $nomClienteproveedor->mayorista = $datos[0]->mayorista;
            $nomClienteproveedor->fechaaprobacion = $datos[0]->fechaaprobacion;
            if (!$add && $datos[0]->fechafin && $nomClienteproveedor->fechafin != date('d/m/Y', strtotime($datos[0]->fechafin))) {
                $nomClienteproveedor->enviadocorreo = 0;
            }
            $nomClienteproveedor->fechafin = $datos[0]->fechafin;
            $nomClienteproveedor->tipoproveedorproducto = $datos[0]->tipoproveedorproducto;
            $nomClienteproveedor->tipoproveedortiempo = $datos[0]->tipoproveedortiempo;
            $idespaciotrabajo = $this->salvarDocumentos($datos, $nomClienteproveedor);
            $documento = $this->salvarDocumento();
            if ($documento) {
                $nomClienteproveedor->certifico = json_encode($documento);
            }
            if($idespaciotrabajo)
                $nomClienteproveedor->idespaciotrabajo = $idespaciotrabajo;
            if (!empty($datos[0]->fechafin)) {
                $nomClienteproveedor->fechafin = $datos[0]->fechafin;
            } else {
                $nomClienteproveedor->fechafin = null;
            }

            if (!empty($datos[0]->idestructura)) {
                $nomClienteproveedor->idestructura = $datos[0]->idestructura;
            } else {
                $nomClienteproveedor->idestructura = null;
            }
            if (!empty($datos[0]->idpersona)) {
                $nomClienteproveedor->idpersona = $datos[0]->idpersona;
            } else {
                $nomClienteproveedor->idpersona = null;
            }

            if ($nomClienteproveedor->registrado == 1) {
                if ($nomClienteproveedor->idpersona) {
                    $condition
                        = array('idpersona'         => $nomClienteproveedor->idpersona,
                        'idestructuracomun' => $idestructuracomun);
                    if (!$add) {
                        $condition['idclientesproveedores']
                            = $nomClienteproveedor->idclientesproveedores;
                    }
                    $exist = $this->existeClienteProveedor($condition);
                } else {
                    $condition
                        = array('idestructura'      => $nomClienteproveedor->idestructura,
                        'idestructuracomun' => $idestructuracomun);
                    if (!$add) {
                        $condition['idclientesproveedores']
                            = $nomClienteproveedor->idclientesproveedores;
                    }
                    $exist = $this->existeClienteProveedor($condition);
                }
            }

            if (!$exist) {
                if (!empty($nomClienteproveedor->idusuario)) {
                    $condClient[] = 'idusuario='
                        . $nomClienteproveedor->idusuario;
                    $condContact[] = 'idusuario='
                        . $nomClienteproveedor->idusuario;;
                    if (!$add) {
                        $condClient[] = 'idclientesproveedores!='
                            . $nomClienteproveedor->idclientesproveedores;
                    }
                    $exist = $nomClienteproveedor->existUser(
                        implode(' AND ', $condClient),
                        implode(' AND ', $condContact)
                    );
                }
                if (!$exist) {
                    if ($this->_codigounico == "true")
                    {
                        if ($nomClienteproveedor->registrado == 0) {
                            $condition
                                = array('codigo'  => $nomClienteproveedor->codigo);
                            if (!$add) {
                                $condition['idclientesproveedores']
                                    = $nomClienteproveedor->idclientesproveedores;
                            }
                            $exist = $this->existeClienteProveedor($condition);
                        }
                    }
                    if (!$exist) {
//                    if ($datos[0]->coneccion) {
//                        Doctrine_Manager::getInstance()->setCurrentConnection(
//                            $datos[0]->coneccion
//                        );
//                    }
                        $con=Doctrine_Manager::getInstance()->getCurrentConnection();
                        $con->beginTransaction();
                        $nomClienteproveedor->save();
                        $idcliente = $nomClienteproveedor->idclientesproveedores;
                        if ($idcliente) {
                            if ($add && $idestructuracomun) {
                                $this->addClienteProveedorEntidad(
                                    $idcliente, $idestructuracomun
                                );
                            }
                            if ($datos[0]->cuentabanco) {
                                $this->addCuentaBanco(
                                    $idcliente, $datos[0]->cuentabanco
                                );
                            }
                            if ($datos[0]->cobrospagos) {
                                $this->addCuentaCobrospagos(
                                    $idcliente, $datos[0]->cobrospagos,
                                    $idestructuracomun
                                );
                            }
                            if ($datos[0]->contactos) {
                                $this->addContactos(
                                    $idcliente, $datos[0]->contactos
                                );
                            }
                            if ($datos[0]->identificadores) {
                                $this->addIdentificadores(
                                    $idcliente, $datos[0]->identificadores
                                );
                            }
                            if ($datos[0]->vehiculos) {
                                $resp=$this->addVehiculos($idcliente, $datos[0]->vehiculos);
                                if($resp)
                                    return array('code' => -6, 'success' => true, 'data'=>$resp, 'idclienteproveedor' => $idcliente);
                            }
                            if ($datos[0]->lineas) {
                                $this->addLineas(
                                    $idcliente, $datos[0]->lineas
                                );
                            }
                        }
//                    if ($datos[0]->coneccion) {
//                        Doctrine_Manager::getInstance()->getCurrentConnection()
//                            ->commit();
//                    }
                        $con->commit();
                        $response['code'] = -1;
                        $response['data']
                            = array('idclienteproveedor' => $idcliente);
                        return $response;
                    } else {
                        $response['code'] = -2;
                        return $response;
                    }
                }
                else {
                    $response['code'] = -3;
                    return $response;
                }
            } else {
                if ($datos[0]->idpersona) {
                    $response['code'] = -4;
                    return $response;
                } else {
                    $response['code'] = -5;
                    return $response;
                }
            }
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    /**
     * @param $arrayIds
     *
     * @return int
     */
    public function eliminar($arrayIds)
    {
        if (count($arrayIds) > 1) {
            foreach ($arrayIds as $key => $id) {
                if (self::delClientOrSupplier($id) === '-4') {
                    return -3;
                }
            }
            return -2;
        } else {
            if (self::delClientOrSupplier($arrayIds[0]) === '-4') {
                return -3;
            } else {
                return -1;
            }
        }
    }

    /**
     * @param $idClientSupplier
     *
     * @return bool|string
     * @throws Doctrine_Connection_Exception
     */
    static function delClientOrSupplier($idClientSupplier)
    {
        $objToDel = Doctrine::getTable('NomClienteproveedor')->find(
            $idClientSupplier
        );
        $dm = Doctrine_Manager::getInstance();
        $cc = $dm->getCurrentConnection();
        try {
            $cc->beginTransaction();
            $objToDel->delete();
            $cc->commit();
            return true;
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) {
                return '-4';
            }
        }
    }

    /**
     * @param $idestructura
     * @param $idpersona
     *
     * @return array|bool
     */
    public function gestEstructuraPersona($idestructura, $idpersona)
    {
        try {
            $datos = array();
            if ($idestructura) {
                $result = $this->integrator->metadatos->DameEstructura(
                    $idestructura
                );
                $datos['idestructura'] = $result[0]->idestructura;
                $datos['nombre'] = $result[0]->denominacion;
                $datos['abreviatura'] = $result[0]->abreviatura;
                $datos['direccion'] = $result[0]->direccion;
                $datos['descripcion'] = $result[0]->text;
                $datos['correo'] = $result[0]->correo;
                $datos['telefono'] = $result[0]->telefono;
                $datos['dpa'] = $result[0]->iddpt;
                $datos['foto'] = $result[0]->icon;
                $datos['codigo'] = $result[0]->codigo;
            } else {
                $persona = $this->integrator->pvd->getPersonaBuscador(true);
                $persona->setParamIdPersona($idpersona);
                $persona->incluirDatosContacto(true, false);
                $persona->incluirDatosDireccion(true, false);
                $persona->incluirDatosIdentidad(true);
                $result = $persona->getBusqueda();
                $datos['nombre'] = $result->data[0]['nombreapellidos'];
                $datos['direccion'] = $result->data[0]['direccion'];
                $datos['correo'] = $result->data[0]['email'];
                $datos['telefono'] = $result->data[0]['telefono'];
                $datos['entidad'] = false;
                $datos['codigo'] = $result->data[0]['numid'];
                $datos['dpa'] = $result->data[0]['idmunicipio'];
                $datos['foto'] = null;
                $foto = $result->data[0]['foto'];
                if (!empty($foto)) {
                    $datos['foto']
                        = 'data:image/jpg;base64,' . $foto;
                }
            }
            if ($datos['dpa']) {
                $descripcionDpa
                    = $this->integrator->datosmaestros->getElementoid(
                    $datos['dpa']
                );
                $datos['descripciondpa'] = $descripcionDpa[0]['denominacion'];
            }
            if ($datos['idtipo'] == 1) {
                $datos['tipocliente'] = 'Cliente';
            } else {
                if ($datos['idtipo'] == 2) {
                    $datos['tipocliente'] = 'Proveedor';
                } else {
                    if ($datos['idtipo'] == 3) {
                        $datos['tipocliente'] = 'Cliente y Proveedor';
                    }
                }
            }
            return $datos;
        } catch (Exception $exc) {
            return false;
        }
    }

    /**
     * @param $array
     *
     * @return bool
     */
    public function existeClienteProveedor($array)
    {
        $nomClienteproveedor = new NomClienteproveedor();
        $keys = array_keys($array);
        foreach ($keys as $key) {
            if ($array[$key]) {
                if ($key != 'idclientesproveedores') {
                    $condition[] = "$key=?";
                    $params[] = $array[$key];
                } else {
                    $condition[] = "$key!=?";
                    $params[] = $array[$key];
                }
            }
        }
        $result = $nomClienteproveedor->getByCondition(
            implode('AND ', $condition), $params
        );
        if (count($result) == 0) {
            $persona = $this->integrator->pvd->getPersonaBuscador(true);
            if (isset($array['codigo'])) {
                $persona->setParamNoIdentidad($array['codigo']);
                $datos = $persona->getBusqueda();
                if ($datos->quantity == 0) {
                    if (isset($array['codigo'])) {
                        $datos
                            = $this->integrator->metadatos->obtenerEstructuraXCod(
                            $array['codigo']
                        );
                    }
                    if (count($datos) != 0) {
                        $idestructura = $datos[0]['idestructura'];
                        $result = $nomClienteproveedor->getByCondition(
                            'idestructura=?', $idestructura
                        );
                        if (count($result) != 0) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                } else {
                    $idpersona = $datos->data[0]['idpersona'];
                    $result = $nomClienteproveedor->getByCondition(
                        'idpersona=?', $idpersona
                    );
                    if (count($result) != 0) {
                        return true;
                    } else {
                        return false;
                    }
                    return true;
                }
            }
        } else {
            return true;
        }
    }

    /**
     * @param $idcliente
     * @param $objeto
     */

    public function getOrganismos($post){
        try{
            $result = NomClienteproveedor::getOrganismos($post);
            return $result;
        }catch (Exception $e){
            throw $e;
        }
    }

    public function getSector($post){
        try{

            $result = NomClienteproveedor::getSector($post);
            return $result;
        }catch (Exception $e){
            throw $e;
        }
    }

    public function addCuentaBanco($idcliente, $objeto)
    {
        try {
            $eliminados = gettype($objeto->eliminados) == 'string'
                ? json_decode(stripcslashes($objeto->eliminados))
                : $objeto->eliminados;
            $modificados = gettype($objeto->modificados) == 'string'
                ? json_decode(stripcslashes($objeto->modificados))
                : $objeto->modificados;
            if (count($eliminados) != 0) {
                DatCuentaBancoCliente::desactiveCuentaBanco($eliminados);
            }
            if (count($modificados) != 0) {
                foreach ($modificados as $valor) {
                    $datCuentaBanco = $valor->id ? Doctrine::getTable(
                        'DatCuentaBancoCliente'
                    )->find($valor->id) : new DatCuentaBancoCliente();
                    $datCuentaBanco->nombrecuenta = $valor->nombrecuenta;
                    $datCuentaBanco->numerocuenta = $valor->numerocuenta;
                    $datCuentaBanco->idmoneda = $valor->idmoneda;
                    if($valor->idsucursal=='')
                    {
                        $datCuentaBanco->idsucursal = null;
                    }else
                    {$datCuentaBanco->idsucursal = $valor->idsucursal;}
                    if($valor->idbanco=='')
                    { $datCuentaBanco->idbanco = null;}
                    else {$datCuentaBanco->idbanco = $valor->idbanco;}
                    $datCuentaBanco->licenciabancaria = $valor->licenciabancaria;
                    $datCuentaBanco->predeterminado = $valor->predeterminada ? 1
                        : 0;
                    $datCuentaBanco->idclienteproveedores = $idcliente;
                    if(!$valor->id){$datCuentaBanco->fechainicio=date('d-m-Y');}
                    $datCuentaBanco->save();
                }
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idcliente
     * @param $objeto
     * @param $idestructura
     */
    public function addCuentaCobrospagos($idcliente, $objeto, $idestructura)
    {
        try {
            $eliminados = gettype($objeto->eliminados) == 'string'
                ? json_decode(stripcslashes($objeto->eliminados))
                : $objeto->eliminados;
            $modificados = gettype($objeto->modificados) == 'string'
                ? json_decode(stripcslashes($objeto->modificados))
                : $objeto->modificados;
            $idestructura = $idestructura ? $idestructura
                : $this->global->Estructura->idestructura;
            if (count($eliminados) != 0) {
                DatClienteProveedorCobroPago::deleteFromArray($eliminados);
            }
            if (count($modificados) != 0) {
                foreach ($modificados as $valor) {
                    $dat = $valor->id ? Doctrine::getTable(
                        'DatClienteProveedorCobroPago'
                    )->find($valor->id)
                        : new DatClienteProveedorCobroPago();
                    $dat->idcuenta = $valor->idcuenta;
                    $dat->clasificacion = $valor->idclasificacion;
                    $dat->idmoneda = $valor->idmoneda;
                    $dat->idclienteproveedor = $idcliente;
                    $dat->idestructura = $idestructura;
                    $dat->idterminodepago = $valor->idterminodepago;
//                    $dat->idoperacionentidad = $valor->idoperacionesentidad?$valor->idoperacionesentidad:null;
                    $dat->save();
                }
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idcliente
     * @param $objeto
     */
    public function addContactos($idcliente, $objeto)
    {
        try {
            $eliminados = gettype($objeto->eliminados) == 'string'
                ? json_decode(stripcslashes($objeto->eliminados))
                : $objeto->eliminados;
            $modificados = gettype($objeto->modificados) == 'string'
                ? json_decode(stripcslashes($objeto->modificados))
                : $objeto->modificados;
            if (count($eliminados) != 0) {
                NomContacto::deleteFromArray($eliminados);
            }
            if (count($modificados) != 0) {
                foreach ($modificados as $valor) {
                    $nomcontacto = $valor->idcontacto ? Doctrine::getTable(
                        'NomContacto'
                    )->find($valor->idcontacto)
                        : new NomContacto();
                    $nomcontacto->nombre = $valor->nombre;
                    $nomcontacto->cargo = $valor->cargo;
                    $nomcontacto->correocontacto = $valor->correocontacto;
                    $nomcontacto->telefono = $valor->telefono;
                    $nomcontacto->movil = $valor->movil;
                    $nomcontacto->direccion = $valor->direccion;
                    $nomcontacto->idclientesproveedores = $idcliente;
                    $nomcontacto->idusuario = $valor->idusuario
                        ? $valor->idusuario : null;
                    $nomcontacto->dpa = $valor->dpa;
                    $nomcontacto->foto = pg_escape_bytea($valor->foto);
                    $nomcontacto->direccionempresa = $valor->direccionempresa
                        ? 1 : 0;
                    $nomcontacto->facultad = $valor->facultad;
                    $nomcontacto->numeroidentidad = $valor->numeroidentidad;
                    $nomcontacto->save();
//                    print_r($valor->tiposfacultades);die;
                    foreach (
                        Doctrine::getTable('DatFacultad')
                            ->findBySql(
                                'idcontacto=' . $nomcontacto->idcontacto
                            ) as $aelimar
                    ) {
                        $aelimar->delete();
                    }
                    if ($valor->tiposfacultades) {
                        $exists = array();
                        $tiposfacultades = gettype($valor->tiposfacultades)
                        == 'string' ?
                            json_decode(stripcslashes($valor->tiposfacultades))
                            : $valor->tiposfacultades;
                        foreach ($tiposfacultades as $tipof) {
                            $tabla = Doctrine::getTable('DatFacultad')
                                ->findBySql(
                                    'idtipofacultad=' . $tipof->idtipofacultad . ' AND
                            idcontacto=' . $nomcontacto->idcontacto
                                )
                                ->getFirst();
                            if (!$tabla) {
                                $tabla = new DatFacultad();
                                $tabla->idtipofacultad = $tipof->idtipofacultad;
                                $tabla->idcontacto = $nomcontacto->idcontacto;
                                $tabla->save();
                            }
                            $exists[] = $tabla->idfacultad;
                        }
                    }
                }
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function addIdentificadores($idcliente, $objeto)
    {
        try {
            $eliminados = gettype($objeto->eliminados) == 'string'
                ? json_decode(stripcslashes($objeto->eliminados))
                : $objeto->eliminados;
            $modificados = gettype($objeto->modificados) == 'string'
                ? json_decode(stripcslashes($objeto->modificados))
                : $objeto->modificados;
            if (count($eliminados) != 0) {
                DatIdentificador::deleteFromArray($eliminados);
            }
            if (count($modificados) != 0) {
                foreach ($modificados as $valor) {
                    $identificador = $valor->ididentificador
                        ? Doctrine::getTable('DatIdentificador')
                            ->find($valor->ididentificador)
                        : new DatIdentificador();
                    $identificador->denominacion = $valor->denominacion;
                    $identificador->idtipocodigo = $valor->idtipocodigo;
                    $identificador->idclienteproveedor = $idcliente;

                    $identificador->save();
                }
            }
        } catch (Doctrine_Exception $e) {
//            print('/*errorzazo identificadores*/');
            throw $e;
        }
    }

    public function addVehiculos($idcliente, $objeto)
    {
        try {
            $eliminados = gettype($objeto->eliminados) == 'string' ? json_decode(stripcslashes($objeto->eliminados))
                : $objeto->eliminados;
            $modificados = gettype($objeto->modificados) == 'string' ? json_decode(stripcslashes($objeto->modificados))
                : $objeto->modificados;
            if (count($eliminados)){
                $this->integrator->logistica->DelIndicadorCliente($idcliente, $eliminados);
            }
            if (count($modificados) != 0) {

                $equipos=array();
//                foreach ($modificados as $prod) {
//                    $equipos[$prod['tipo']][]=array(
//                        'denominacion'=>$prod['denominacion'], 'codigo'=>$prod['matriculo'],
//                        'marca'=>$prod['marca'], 'modelo'=>$prod['modelo'], 'serie'=>$prod['serie']);
//                }
//                $result=$this->integrator->datosmaestros->buscarEstSubSistPorId($this->global->Estructura->idestructura);
//
//                $this->integrator->datosmaestros->addIndicadorExterno($equipos);
                $reasignar=false;
                foreach ($modificados as $prod) {
//                    $producto = $prod->idvehiculocontrato ? Doctrine::getTable('DatVehiculoClienteProveedor')
//                        ->find($prod->idvehiculocontrato) : new DatVehiculoClienteProveedor();
////                    $producto->idmarca = $prod->idmarca ? $prod->marca : null;
////                    $producto->idmodelo = $prod->idmodelo ? $prod->modelo : null;
//                    $producto->denominacion = $prod->denominacion;
//                    $producto->provincia = $prod->provincia ? $prod->provincia: null;
//                    $producto->idclienteproveedor = $idcliente;
////                    $producto->idindicador = $prod->idindicador;
//                    $producto->chapa = $prod->chapa ? $prod->chapa: null;
//                    $producto->tipomedio = $prod->tipomedio ? $prod->tipomedio: null;
////                    $producto->modelo = $prod->modelo ? $prod->modelo : null;
//                    $producto->datos = $prod->datos_json ? json_encode($prod->datos_json) : null;
//                    $producto->save();
                    //$prod->tipo = 'auto';//aqui debe ir el tipo de medio que estan adicionando (auto, moto, camion, Omnibus, camioneta,panel,auto panel, etc)
                    $equipos[$prod->tipo][]=array('denominacion' => $prod->denominacion, 'naturaleza'=> null,
                        'marca' => $prod->codigo?$prod->codigo:$prod->marca, 'modelo' => $prod->modelo, 'contrato'=>null,
                        'codigo'=>$prod->matricula, 'serie'=>$prod->serie, 'anno'=>$prod->ano!=''?$prod->ano:null);
                    if($prod->reasignar==1)$reasignar=true;
                }
                if(count($equipos)){
                    $params=array(
                        'equipos'=>$equipos,
                        'idcliente'=>$idcliente,
                    );
                    if($reasignar)$params['reasignar']=1;
                    $respuesta = $this->integrator->logistica->AddIndicadorExterno($params);
                    if($respuesta){
//                        print('/*respuesta*/');
                        return $respuesta;
                    }

                }
            }
        } catch (Doctrine_Exception $e) {
//            print('/*errorzazo identificadores*/');
            throw $e;
        }
    }

    public function addLineas($idcliente, $objeto){
        try {
            $eliminados = gettype($objeto->eliminados) == 'string'
                ? json_decode(stripcslashes($objeto->eliminados))
                : $objeto->eliminados;
            $modificados = gettype($objeto->modificados) == 'string'
                ? json_decode(stripcslashes($objeto->modificados))
                : $objeto->modificados;
            if (count($eliminados) != 0) {
                DatClienteProveedorLinea::deleteFromArray($eliminados);
            }
            if (count($modificados) != 0) {
                foreach ($modificados as $valor) {
                    $lineas = $valor->idclienteproveedorlinea
                        ? Doctrine::getTable('DatClienteProveedorLinea')
                            ->find($valor->idclienteproveedorlinea)
                        : new DatClienteProveedorLinea();
                    $lineas->idlinea = $valor->idnaturaleza;
                    $lineas->idtipolinea = $valor->idtipolinea?:null;
                    $lineas->idclienteproveedor = $idcliente;
                    $lineas->save();
                }
            }
        }catch(Doctrine_Exception $e){
            throw $e;
        }
    }

    /**
     * @param $post
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function addPtoMapa($post)
    {
        try {
            $idestructura = $this->global->Estructura->idestructura;
            if ($post['idestructura']) {
                $idestructura = $post['idestructura'];
            }
            $result = DatClienteProveedorMapa::addPtoMapa(
                $post['idcliente'], $idestructura, $post
            );
            return array('idmapa' => $result);
        } catch (Doctrine_Exception $exception) {
            throw $exception;
        }
    }

    /**
     * @param $post
     *
     * @return array
     */
    public function cargarDatosEspaciales($post)
    {
        $idestructura = $this->global->Estructura->idestructura;
        if ($post['idestructura']) {
            $idestructura = $post['idestructura'];
        }
        $datmapa = new DatClienteProveedorMapa();

        if ($post['idcliente']) {
            $result = $datmapa->getByCondition(
                array('idclientesproveedores' => $post['idcliente'])
            );
        } else {
            $result = $datmapa->getByCondition(
                array('idestructuracomun' => $idestructura)
            );
        }
        return $result;
    }

    /**
     * @param      $idcliente
     * @param bool $contactos
     * @param null $idestructura
     * @param null $cobrospagos
     * @param null $moneda
     * @param null $cuenta
     *
     * @return array
     */
    public function obtenerDatosAdicionales(
        $idcliente, $contactos = false, $idestructura = null,
        $cobrospagos = null, $moneda = null, $cuenta = null, $contratos = null, $vehiculo = null
    ) {
        $cuentas = array();
        $vehiculos=null;
        $idestructura = $idestructura ? $idestructura
            : $this->global->Estructura->idestructura;
        if ($contactos) {
            $result = NomContacto::getContactoByIdCliente($idcliente);
        } else {
            if ($contratos) {
                $objDoctrine = Doctrine_Manager::getInstance();
                $conexionActual = $objDoctrine->getCurrentConnection();
                $datos = $conexionActual->fetchAll(
                    "(SELECT c.numerocontrato,
                (CASE WHEN c.numerocontrato='' THEN c.nombre ELSE c.numerocontrato END) as denominacion,
                (CASE WHEN c.cumplimientoobligaciones=1 OR c.fechafirma <= CURRENT_DATE AND (c.fechafin>=CURRENT_DATE OR c.fechafin ISNULL) THEN 'Si' ELSE 'No' END) as vigente, c.fechafin as fechafin			
                FROM mod_crmcontratacion.dat_contrato c 
                WHERE 
                c.idclienteproveedor=$idcliente and c.activocontrato=1 and c.cliente=1)  
                UNION
                (SELECT c.numerocontrato,
                (CASE WHEN c.numerocontrato='' THEN c.nombre ELSE c.numerocontrato END) as denominacion,
                (CASE WHEN c.cumplimientoobligaciones=1 OR c.fechafirma <= CURRENT_DATE AND (c.fechafin>=CURRENT_DATE OR c.fechafin ISNULL) THEN 'Si' ELSE 'No' END) as vigente, c.fechafin as fechafin			
                FROM mod_crmcontratacion.dat_contrato c inner join mod_crmcontratacion.dat_contratoclienteasociado cc on c.idcontrato= cc.idcontrato
                WHERE 
                cc.idclienteproveedor=$idcliente and c.activocontrato=1 and c.cliente=1)				
			"
                );
                $result = array('total'     => count($datos),
                    'contratos' => $datos);
            } else {
                $result = DatCuentaBancoCliente::getCuentaBancoByIdCliente(
                    $idcliente
                );
                if ($this->existeContabilidad()) {
                    $cuentas
                        = DatClienteProveedorCobroPago::getCuentasbyClienteProveedor(
                        $idcliente, $idestructura, $cobrospagos, $moneda,
                        $cuenta
                    );
                }
                $datos = $this->cargarCodigos(
                    array('idclienteproveedor' => $idcliente)
                );
                $identificadores = array('total' => count($datos),
                    'data'  => $datos);
                if($vehiculo)
                    $vehiculos=$this->cargarVehiculos(array('idclienteproveedor' => $idcliente));
            }
        }
        /*try {
            $certifico = $this->obtenerCertifico($idcliente);
        }catch(Exception $e){
//            print('ERRORZAZO');die;
            $certifico = null;
        }*/
//        $certifico = $this->obtenerCertifico($idcliente);
        return array('cuentas'         => $cuentas, 'data' => $result,
            'certifico'       => $certifico, 'vehiculo'=> $vehiculos,
            'identificadores' => $identificadores);
    }

    /**
     * @return array
     */
    public function cargarBancos()
    {
        $result = $this->integrator->datosmaestros->obtenerBancos();
        return array('datos' => $result);
    }

    /**
     * @param $idbanco
     *
     * @return array
     */
    public function cargarSucursales($idbanco)
    {
        $result = $this->integrator->datosmaestros->obtenerSucursales($idbanco);
        return array('datos' => $result);
    }

    /**
     * @param $idestructura
     *
     * @return mixed
     */
    public function cargarMonedas($idestructura)
    {
        return $this->integrator->datosmaestros->obtenerMonedasPorEntidad(
            $idestructura
        );
    }

    /**
     * @param      $start
     * @param      $limit
     * @param null $nombre
     *
     * @return array
     */
    public function cargarUsuarios($start, $limit, $nombre = null)
    {
        $cant = $this->integrator->seguridad->cantidadUsuarios();
        $result = $this->integrator->seguridad->getUserList(
            $limit, $start, $nombre
        );
        return array('cant' => $cant, 'datos' => $result['datos']);
    }

    /**
     * @param $alias
     *
     * @return Doctrine_Query
     */
    public function getQuery($alias)
    {
        return NomClienteproveedor::getQuery();
    }

    /**
     * @param $post
     *
     * @return array
     */
    public function existUser($post)
    {
        $nomClienteProveedor = new NomClienteproveedor();
        $response = array('code' => -1);
        if ($post['idusuario']) {
            $condClient[] = 'idusuario=' . $post['idusuario'];
            $condContact[] = 'idusuario=' . $post['idusuario'];
        }
        if ($post['idclientesproveedores']) {
            $condClient[]
                = 'idclientesproveedores!=' . $post['idclientesproveedores'];
        }

        if ($post['idcontacto']) {
            $condContact[] = 'idcontacto!=' . $post['idcontacto'];
        }

        if ($post['eliminados']) {
            $eliminados = json_decode(stripcslashes($post['eliminados']));
            $condContact[]
                = "idcontacto not in (" . implode(',', $eliminados) . ")";
        }
        $exist = $nomClienteProveedor->existUser(
            implode(' AND ', $condClient), implode(' AND ', $condContact)
        );

        if ($exist) {
            $response['code'] = -7;
        }

        return $response;
    }

    /**
     * @param $idusuario
     *
     * @return null
     */
    public function getClienteProveedorByUser($idusuario)
    {
        $nomcliente = new NomClienteproveedor();
        $nomcontacto = new NomContacto();
        $idcliente = null;
        $condition[] = 'idusuario=?';
        $params[] = $idusuario;

        $result = $nomcliente->getByCondition(
            implode(' AND ', $condition), $params
        );
        if ($result) {
            $idcliente = $result[0]['idclientesproveedores'];
        } else {
            $result = $nomcontacto->getByCondition(
                implode(' AND ', $condition), $params
            );
            if ($result) {
                $idcliente = $result[0]['idclientesproveedores'];
            }
        }
        return $idcliente;
    }

    /**
     * @return string
     */
    public function devolverJS()
    {
        $js
            = '<script type="text/javascript" src="/configuracion/clientesyproveedores/views/js/clientesyproveedores/Ext.DatMaest.ClientProveed.Panel.js"></script>';
        $js .= '<script type="text/javascript" src="/configuracion/comun/views/js/Ext.Cont.SearchField.js"></script>';
        $existe = $this->existeGis();
        $js .= '<script type="text/javascript"> var existe_gis=' . json_encode(
                $existe
            ) . '</script>';
        if ($existe) {
            $js .= $this->integrator->gis->DevolverJS();
            $js .= '<script type="text/javascript" src="/configuracion/comun/views/js/Ext.ComponentMap.js"></script>';
            //$js .= '<script type="text/javascript" src="/configuracion/comun/views/js/OpenLayers/OpenLayers.js"></script>';
        }
        return $js;
    }

    /**
     * @return string
     */
    public function devolverCSS()
    {
        $js
            = '<link rel="stylesheet" type="text/css" href="/configuracion/clientesyproveedores/views/css/data-view.css"/>';
        $js .= '<link rel="stylesheet" type="text/css" href="/configuracion/clientesyproveedores/views/css/iconFont.css"/>';
        return $js;
    }

    /**
     * @return bool
     */
    public function existeGis()
    {
        try {
            $dir = Zend_Registry::get('config')->dir_aplication
                . 'gis/comun/recursos/xml/ioc.xml';
            return file_exists($dir);
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * @return bool
     */
    public function existeContabilidad()
    {
        try {
            $dir = Zend_Registry::get('config')->dir_aplication
                . 'contabilidad/comun/recursos/xml/ioc.xml';
            return file_exists($dir);
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * @param $post
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function usarEntidad($post)
    {
        try {
            $ids = json_decode($post['arrayId']);
            $idestructura = $this->global->Estructura->idestructura;
            if ($post['idestructura']) {
                $idestructura = $post['idestructura'];
            }
            foreach ($ids as $value) {
                $this->addClienteProveedorEntidad($value, $idestructura);
            }
            return array('code' => -1);
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $post
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function noUsarEntidad($post)
    {
        try {
            $ids = json_decode($post['arrayId']);
            $idestructura = $this->global->Estructura->idestructura;
            if ($post['idestructura']) {
                $idestructura = $post['idestructura'];
            }
            if(count($ids) > 0)
                $query = Doctrine_Query::create()
                    ->delete('DatClienteProveedorEntidad')
                    ->whereIn('idclienteproveedor', $ids)
                    ->addWhere('idestructuracomun = ?', $idestructura)
                    ->execute();
            return array('code' => -1);
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idcliente
     * @param $idestructura
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function addClienteProveedorEntidad($idcliente, $idestructura)
    {
        try {
            $instance = new DatClienteProveedorEntidad();
            $instance->idclienteproveedor = $idcliente;
            $instance->idestructuracomun = $idestructura;
            $instance->save();
            if ($instance->idclienteproveedorentidad) {
                $this->addClienteTipoprecioPorDefecto($idcliente);
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $post
     *
     * @return mixed
     */
    public function obtenerCondicionesPago($post)
    {
        $result = $this->integrator->datosmaestros->obtenerCondicionesPago(
            $post
        );
        return $result;
    }

    /**
     * Obtiene el espacio de trabajo del cliente proveedor donde se guardan sus contratos
     *
     * @param $parametros
     *
     * @throws Exception
     */
    public function obtenerEspacioTrabajo($parametros)
    {
        try {
            $resultado = NomClienteproveedor::obtenerClientesproveedores(
                $parametros
            );
            $resultado = $resultado['datos'];
            if (count($resultado)) {
                $cliente = $resultado[0];
                $espacio = json_decode($cliente['idespaciotrabajo']);
                $idespacio = $espacio->$parametros['proceso'];
                if ($idespacio) {
                    return array('idespaciotrabajo' => $idespacio);
                } else {
                    $parametros['nombre'] = $resultado[0]['nombre'];
                    $parametros['idclienteproveedorentidad']
                        = $resultado[0]['idclienteproveedorentidad'];
                    $resultado = $this->crearEspacioTrabajo($parametros);
                    return array('idespaciotrabajo' => $resultado);
                }
            }
            return array('idespaciotrabajo' => $parametros['idespaciotrabajo']);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Crea un espacio de trabajo para los contratos de un cliente proveedor por entidad
     *
     * @param $parametros
     *
     * @throws Exception
     */
    public function crearEspacioTrabajo($parametros)
    {
        try {

            $idnodo = $parametros['idespaciotrabajo'];
            $nombre = $this->formatearNombre($parametros['nombre']);
            if ($idnodo && $this->testGD()) {

                $result = $this->_gestordocumental->adicionarEspacioTrabajo(
                    $idnodo, $nombre, $nombre, array()
                );
                if (count($result['identificadorNodoPadre'])) {
                    if (is_object($result['identificadorNodoPadre'])) {
                        $result['identificadorNodoPadre']
                            = (array)$result['identificadorNodoPadre'];
                    }
                    $idnodo = explode(
                        '/', $result['identificadorNodoPadre']['id']
                    );
                    $idnodo = $idnodo[count($idnodo) - 1];
                    $parametros['idespaciotrabajo'] = $idnodo;
                    $this->salvarClienteEspacioTrabajo($parametros);
                }
                return $idnodo;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function formatearNombre($nombre)
    {
        $conservar = '0-9a-z\_\s'; // juego de caracteres a conservar
        $regex = sprintf('~[^%s]++~i', $conservar); // case insensitive
        return preg_replace($regex, '', $nombre);
    }

    /**
     * Salva en la entidad DatClienteProveedorEntidad con su espacio de trabajo
     *
     * @param $parametros
     *
     * @throws Exception
     */
    public function salvarClienteEspacioTrabajo($parametros)
    {
        try {
            if ($parametros['coneccion']) {
                Doctrine_Manager::getInstance()->setCurrentConnection(
                    $parametros['coneccion']
                );
            }
            $cliente = Doctrine::getTable('DatClienteProveedorEntidad')->find(
                $parametros['idclienteproveedorentidad']
            );
            $clave = $parametros['proceso'] ? $parametros['proceso']
                : 'proceso';
            if ($cliente->idespaciotrabajo) {
                $espacios = json_decode($cliente->idespaciotrabajo);
                if (is_array($espacios)) {
                    $espacios[$clave] = $parametros['idespaciotrabajo'];
                }
                if (is_object($espacios)) {
                    $espacios = (array)$espacios;
                    $espacios[$clave] = $parametros['idespaciotrabajo'];
                }
            } else {
                $espacios = array($clave => $parametros['idespaciotrabajo']);
            }
            $cliente->idespaciotrabajo = json_encode($espacios);
            $cliente->save();
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Obtiene todos los espacios de trabajo creados en el gestor documental
     *
     * @param $parametros
     *
     * @throws Exception
     */
    public function obtenerEspaciosTrabajo($parametros)
    {
        try {
            $result = array();
            if ($this->testGD()) {
                $node = $parametros['node'];
                if ($node == '0') {
                    settype($node, 'int');
                }
                $espacios = $this->_gestordocumental->obtenerContenidos(
                    array('id' => $node)
                );
                $result = array();
                foreach ($espacios->objectList as $value) {
                    if ($value->properties['cmis:baseTypeId']
                        == 'cmis:folder'
                    ) {
                        $idespacio = explode(
                            '/', $value->properties['cmis:objectId']
                        );
                        $result[] = array(
                            'text' => $value->properties['cmis:name'],
                            'id'   => $idespacio[count($idespacio) - 1]
                        );
                    }
                }
            }else{
                $result[] = array(
                    'text' => '<b style="color:red">No est&aacute; activado el gestor documental</b>',
                    'id'=> 'msgError',
                    'leaf'=> true
                );
            }
            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Crea el espacio de trabajo para salvar los certificos de los clientes y proveedores
     *
     * @param $parametros
     *
     * @return array
     */
    public function salvarEspacioTrabajoCertifico($parametros)
    {
        try {
            $idestructura = $this->global->Estructura->idestructura;
            if ($parametros['idestructura']) {
                $idestructura = $parametros['idestructura'];
            }
            if ($parametros['idclienteproveedorespacio']) {
                $espaciotrabajo = Doctrine::getTable(
                    'DatClienteProveedorEspacioTrabajo'
                )->find(
                    $parametros['idclienteproveedorespacio']
                );
            } else {
                $espaciotrabajo = new DatClienteProveedorEspacioTrabajo();
            }
            $espaciotrabajo->idestructura = $idestructura;
            $espaciotrabajo->idespaciotrabajo = $parametros['idespaciotrabajo'];
            $espaciotrabajo->nombreespaciotrabajo= $parametros['nombreespaciotrabajo'];
            $espaciotrabajo->save();//idclienteproveedorentidad
            if($parametros['idclienteproveedorentidad']){
                $cliente = Doctrine::getTable('DatClienteProveedorEntidad')->find(
                    $parametros['idclienteproveedorentidad']
                );
                if($cliente){
                    $espacios=array();
                    foreach ($parametros as $key=>$value){
                        if($value && in_array($key, array('contrato', 'oferta', 'solicitud'))){
                            $espacios[$key]=$value;
                        }
                    }
                    if(count($espacios)>0){
                        $cliente->idespaciotrabajo = json_encode($espacios);
                    }else{
                        $cliente->idespaciotrabajo = null;
                    }
                    $cliente->save();
                }
            }
            return array('code' => 1, 'success' => true);
        } catch (Exception $e) {
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                'success' => false);
        }
    }


    /**
     * Obtiene el espacio de trabajo configurado para guardar los certificos de los clientes y proveedores
     *
     * @param $parametros
     *
     * @throws Exception
     */
    public function obtenerEspacioTrabajoCertifico()
    {
        try {
            $espaciotrabajo = new DatClienteProveedorEspacioTrabajo();
            return $espaciotrabajo->obtenerPorParametros(array());
        } catch (Exception $e) {
            throw $e;
        }
    }
//
//    public function obtenerEspacioTrabajoAuxiliares(){
//        try{
//            $clienteentidad=new DatClienteProveedorEntidad();
//
//            return $clienteentidad->obtenerClienteProveedor();
//        } catch (Exception $e) {
//            throw $e;
//        }
//    }

    private function formatName($nombre)
    {
        $conservar = '0-9a-z\_\s'; // juego de caracteres a conservar
        $regex = sprintf('~[^%s]++~i', $conservar); // case insensitive
        return preg_replace($regex, '', $nombre);
    }
    public function salvarDocumentos($datos, $cliente){
        try {
            $documentos = [];
            if ($this->testGD() && count($_FILES)) {
                $idnodo = $this->obtenerEspacioTrabajoCertifico(
                    array()
                )['idespaciotrabajo'];
                $idespaciotrabajo = $cliente->idespaciotrabajo;
                if(!$cliente->idespaciotrabajo){
                    $result = $this->_gestordocumental->adicionarEspacioTrabajo(
                        $idnodo, $datos[0]->nombre, $datos[0]->nombre, array());
                    if (count($result['identificadorNodoPadre'])) {
                        $datoidespacio=gettype($result['identificadorNodoPadre'])=='array'?
                            $result['identificadorNodoPadre']['id']:
                            $result['identificadorNodoPadre']->id;
                        $idespaciotrabajo = explode('/', $datoidespacio);
                        $idespaciotrabajo = $idespaciotrabajo[count($idespaciotrabajo) - 1];
                    }
                }
//                print_r($_FILES);die;
                foreach ($_FILES as $key => &$file) {
//                    print_r($file);die;
                    if($key != 'certifico' && $file['name']){
//                        $nombre_final = $file['name'];
                        $extension = '';
                        $temp = explode('.', $file['name']);
                        if(count($temp))$extension=array_pop($temp);
                        $id = explode('adjunto_archivo_', $key)[1];
                        $nombre_final = ($datos[0]->{'nombre_archivo_'.$id}? :implode('', $temp)).($extension?'.'.$extension:'');
                        $result = $this->_gestordocumental->adicionarDocumento(
                            $idespaciotrabajo, $nombre_final, $file['type'], [], $file, $nombre_final, null, null,
                            null
                        );
                        if($result->id)
                            $documentos[] = array('id' => $result->id, 'name' => $nombre_final);
                    }
                }


//                $file = $_FILES['certifico'];
//                $name = $file['name'] . '-' . $this->generateRandomString(10);
//                $result = $this->_gestordocumental->adicionarDocumento(
//                    $idnodo, $name, $file['type'], [], $file, $name, null, null,
//                    null
//                );
//                if ($result->id) {
//                    return array('id' => $result->id, 'name' => $file['name']);
//                }

//                print_r(json_decode($datos[0]->removedAdjuntos));die;
                $modificados = json_decode($datos[0]->modifiedAdjuntos);
                $eliminados = json_decode($datos[0]->removedAdjuntos);
                if (count($modificados)) {
    //                $this->modificarDocumentos($modificados);
                    foreach ($modificados as $doc) {
                        $extension = '';
                        $temp = explode('.', $doc->nombreArchivo);
                        if(count($temp))$extension=array_pop($temp);
                        $nombre_final = ($doc->nombre).($extension?'.'.$extension:'');
                        $result = $this->_gestordocumental->modificarDocumento(
                            $doc->idnodo, $nombre_final, $nombre_final, array()
                        );
                        if (!$result['success']) {
                            throw new Exception('Ocurrio un error editando el documento', 336);
                        }
                    }
                }
                if (count($eliminados)) {
//                    print('/*eliminados*/');
    //                $this->eliminarDocumentos($eliminados);
                    $this->_gestordocumental->eliminarElementosContenido($eliminados);
                }
                return $idespaciotrabajo;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function salvarDocumento()
    {
        try {
            if ($this->testGD() && $_FILES['certifico']['name']) {
                $idnodo = $this->obtenerEspacioTrabajoCertifico(
                    array()
                )['idespaciotrabajo'];

                $file = $_FILES['certifico'];
                $name = $file['name'] . '-' . $this->generateRandomString(10);
                $result = $this->_gestordocumental->adicionarDocumento(
                    $idnodo, $name, $file['type'], [], $file, $name, null, null,
                    null
                );
                if ($result->id) {
                    return array('id' => $result->id, 'name' => $file['name']);
                }
            }
            return false;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Verifica código, servidor y auntenticacion del gestor documental
     *
     * @author Ing. Lisvany Alonso Martinez
     * @return bool
     */
    private function testGD()
    {
        try {
            $baseurl = realpath(dirname(__FILE__)) . '/';
            $gcontserviceurl = $baseurl
                . '../../../../alfresco/GestioncontenidoService.php';
            $apialfrescourl = $baseurl . '../../../../alfresco/APIAlfresco.php';
//            $conf=$this->integrator->crm->cargarConfGeClienteProveedor();
            $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
            $conf = $conn->fetchAll("SELECT * FROM mod_crmadministracion.conf_clientesproveedores");
//            print_r($conf);die;
            if (count($conf) && $conf[0]['activo'] && file_exists($gcontserviceurl) && file_exists($apialfrescourl)) {
//            if (file_exists($gcontserviceurl) && file_exists($apialfrescourl)) {
                require_once($gcontserviceurl);
                require_once($apialfrescourl);
                $this->_gestordocumental = new GestioncontenidoService();
//                print_r($this->_gestordocumental);die;
                return true;
            }
            return false;
        } catch (Exception $e) {
            return false;
        }
    }

    private function generateRandomString($length = 10)
    {
        $characters
            = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    private function obtenerCertifico($idcliente)
    {
        try {
            $cliente = Doctrine::getTable('NomClienteproveedor')->find(
                $idcliente
            );
            $certifico = json_decode($cliente->certifico);
            if ($cliente && $certifico && $this->testGD()) {
//                $documento = $this->integrator->gestordocumental->abrirdocumento($certifico->id);
                $documento = $this->_gestordocumental->abrirdocumento(
                    $certifico->id
                );
                $certifico->url = $documento;
            }
            return $certifico;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function obtenerIdCodigos($post)
    {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $where = '';
        if ($post['denominacion'] != '' && $post['denominacion'] != null) {
            $where = "WHERE c.denominacion ILIKE '%" . $post['denominacion']
                . "%'";
        }
        $resp = $conexionActual->fetchAll(
            "SELECT * FROM mod_crmclienteproveedor.nom_tipocodigo c $where"
        );
        $cant = $conexionActual->fetchAll(
            "SELECT count(c.idtipocodigo) FROM mod_crmclienteproveedor.nom_tipocodigo c $where"
        );
        return array('data' => $resp, 'total' => $cant[0]['count']);
    }

    public function cargarCodigos($post)
    {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $where = '';
        if ($post['idclienteproveedor'] != ''
            && $post['idclienteproveedor'] != null
        ) {
            $where = "WHERE c.idclienteproveedor ="
                . $post['idclienteproveedor'];
        }
        $resp = $conexionActual->fetchAll(
            "SELECT c.*, tc.denominacion AS codigonombre 
            FROM mod_crmclienteproveedor.dat_identificador c 
            LEFT JOIN mod_crmclienteproveedor.nom_tipocodigo tc 
            ON c.idtipocodigo=tc.idtipocodigo $where"
        );
        return $resp;
    }

    public function cargarVehiculos($post)
    {
        try {
            $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
            $where = '';
            if ($post['idclienteproveedor'] != '' && $post['idclienteproveedor'] != null) {
                $where = " AND ic.idcliente =" . $post['idclienteproveedor'];
            }
            $resp = $conexionActual->fetchAll(
                "SELECT i.idindicador, i.denominacion, marc.denominacion as marca, marc.codigo, 
                model.denominacion as modelo, i.numeropieza as serie, ih.codigoauxiliar as matricula2,
                ic.ano, ic.codigoaux as matricula
                FROM mod_datosmaestros.nom_indicador i
                INNER JOIN mod_datosmaestros.dat_indicadorcliente ic ON i.idindicador=ic.idindicador 
                INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on i.idindicador = ih.idindicador
                LEFT JOIN mod_datosmaestros.nom_marca marc on ih.idmarca = marc.idmarca
                LEFT JOIN mod_datosmaestros.nom_modelo model on ih.idmodelo = model.idmodelo
                WHERE ic.estado=1 ".$where
            );
//            print("SELECT i.*
//                FROM mod_datosmaestros.nom_indicador i
//                INNER JOIN mod_datosmaestros.dat_indicadorcliente ic ON i.idindicador=ic.idindicador ".$where);die;
//        $resp = $conexionActual->fetchAll(
//            "SELECT v.*
//            FROM mod_crmcontratacion.dat_vehiculocontrato v
//            $where"
//        );
            return $resp;
        }catch(Exception $e){
            throw $e;
        }
    }

    public function obtenerTiposFacultades($post)
    {
        try {
            return DatFacultad::obtenerFacultades($post);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function obtenerContratos($post)
    {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $resp = $conexionActual->fetchAll(
            'SELECT c.numerocontrato FROM mod_crmcontratacion.dat_contrato c 
             WHERE c.idclienteproveedor=' . $post['idclienteproveedor']
        );
        $cant = $conexionActual->fetchAll(
            'SELECT count(c.idcontrato) FROM mod_crmcontratacion.dat_contrato c 
             WHERE c.idclienteproveedor=' . $post['idclienteproveedor']
        );
        return array('data' => $resp, 'total' => $cant[0]['count']);
    }

    public function addClienteTipoprecioPorDefecto($idcliente)
    {
        try {

            $cliente = Doctrine::getTable('NomClienteproveedor')->find(
                $idcliente
            );
            if ($this->testFacturacion() && $cliente
                && ($cliente->idtipo == 1
                    || $cliente->idtipo == 3)
            ) {
                $this->integrator->facturacion->addClienteTipoprecioPorDefecto(
                    array('idclientesproveedores' => $idcliente)
                );
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function testFacturacion()
    {
        try {
            $dir = Zend_Registry::get('config')->dir_aplication
                . 'logistica/facturacion/facturacion/comun_fact/recursos/xml/ioc.xml';
            if (file_exists($dir)) {
                $facturacion = simplexml_load_file($dir);
                return $facturacion->facturacion->addClienteTipoprecioPorDefecto;
            }
            return false;
        } catch (Exception $e) {
            return false;
        }
    }

    public function getLineas($params){
//        return $this->integrator->crm->obtenerLineas();
        try {
            $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
            $where = "";
            $limits = "";
            if ($params['denominacion']) {
                $where = " WHERE n.denominacion ILIKE '%" . $params['denominacion'] . "%' ";
            }
            if($params['limit']){
                $limits=" LIMIT " . $params['limit'] . " OFFSET " . ($params['start']?$params['start']:0);
            }
            $result = $conexionActual->fetchAll(
                "SELECT count(n.idnaturaleza) over(), n.idnaturaleza, n.denominacion, n.idnaturaleza as idindicador
                    FROM mod_datosmaestros.nom_naturaleza n
                    $where
                    ORDER BY n.denominacion
                    ".$limits
            );
            return array('total'=>count($result)>0?$result[0]['count']:0, 'datos'=>$result);
        }catch (Exception $e) {
            throw $e;
        }
    }

    public function obtenerTiposLineas($post){
//        return $this->integrator->crm->obtenerTiposLineas($post);
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $where=''; $arrwhere=[];
        foreach($post as $index=>$value){
            if($index=='lineas'){
                $arrwhere[]=" tl.lineas::text like '%".$value."%' ";
            }
        }
        if(count($arrwhere)>0)
            $where=' WHERE '.implode(' AND ', $arrwhere);
        $resp = $conexionActual->fetchAll(
            'SELECT tl.* FROM mod_crmcontratacion.nom_tipolinea tl '.$where
        );
        $cant = $conexionActual->fetchAll(
            'SELECT count(tl.idtipolinea) FROM mod_crmcontratacion.nom_tipolinea tl '.$where
        );
        return array('data' => $resp, 'total' => $cant[0]['count']);
    }

    public function obtenerLineasClientes($params){
        try{
            $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
            $where='';
            if($params['idcliente']){
                $where=' WHERE cpl.idclienteproveedor='.$params['idcliente'];
            }
            $result=$conexionActual->fetchAll(
                "SELECT cpl.*, tl.denominacion as tipolinea, cpl.idlinea as idnaturaleza
                    FROM mod_datosmaestros.dat_clienteproveedorlinea cpl 
                    LEFT JOIN mod_crmcontratacion.nom_tipolinea tl ON tl.idtipolinea=cpl.idtipolinea
                    ".$where
            );
            function returnDenominacion($item){
                return $item['denominacion'];
            }
            function returnIdNaturaleza($item){
                return array('data'=>$item);
            }
            foreach ($result as &$value){
//                $naturalezas = $conexionActual->fetchColumn(
//                    "SELECT n.denominacion FROM mod_datosmaestros.nom_naturaleza n
//                                WHERE n.idnaturaleza IN (".$value['idnaturaleza'].")"
//                );
//                $value['denominacion'] = implode(',', $naturalezas);
                $naturalezas = $conexionActual->fetchAll(
                    "SELECT n.denominacion, n.idnaturaleza, true as checked FROM mod_datosmaestros.nom_naturaleza n 
                                WHERE n.idnaturaleza IN (".$value['idnaturaleza'].")"
                );

                $value['denominacion'] = implode(',', array_map("returnDenominacion", $naturalezas));
                $value['idnaturaleza'] = array_map("returnIdNaturaleza", $naturalezas);
            }
            return array('success'=>true, 'data'=>$result, 'total'=>count($result));
        }catch(Exception $e){
            throw $e;
        }
    }

    public function obtenerAtributosVehiculos($params){
        return $this->integrator->datosmaestros->getAtributosDinamicosIndicador(array('arrIdesTablas'=>"[".$params['arridtablas']."]"));
    }

    public function cargarproductos($params){
        $params['idestructura'] = $this->_idestructura;
//        return $this->_logistica->getProductService($params);
        try{
            return $this->integrator->logistica->getIndicadoresByParams($params,0,1);
        }catch (Exception $e){
            return array();
        }
//        return $this->contrato->getProducto($params);
    }

    public function exportarExcel($params){
        $cond['idestructuracomun'] = $this->global->Estructura->idestructura;
        $datos = $this->cargarClientesproveedores($cond, false, null, null, false);
        $objPHPExcel = new PHPExcel();
        $objPHPExcel->setActiveSheetIndex(0);
        $objPHPExcel->getActiveSheet()->setTitle('Clientes y proveedores');
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(90);
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(150);
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(150);
        $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(150);
        $objPHPExcel->getActiveSheet()->setCellValue('A1', 'Código');
        $objPHPExcel->getActiveSheet()->setCellValue('B1', 'Nombre');
        $objPHPExcel->getActiveSheet()->setCellValue('C1', 'Clasificación');
        $objPHPExcel->getActiveSheet()->setCellValue('D1', 'Dirección');
        $objPHPExcel->getActiveSheet()->setCellValue('E1', 'Organismo');
        $objPHPExcel->getActiveSheet()->setCellValue('F1', 'Sector');
        $cont=2;
        foreach($datos['datos'] as $cli){
            $tipo='Cliente-Proveedor';
            if($cli['idtipo']==1){
                $tipo='Cliente';
            }else if($cli['idtipo']==2){
                $tipo='Proveedor';
            }
            $objPHPExcel->getActiveSheet()->setCellValue('A'.$cont, $cli['codigo']);
            $objPHPExcel->getActiveSheet()->setCellValue('B'.$cont, $cli['nombre']);
            $objPHPExcel->getActiveSheet()->setCellValue('C'.$cont, $tipo);
            $objPHPExcel->getActiveSheet()->setCellValue('D'.$cont, $cli['direccion']);
            $objPHPExcel->getActiveSheet()->setCellValue('E'.$cont, $cli['organismo']);
            $objPHPExcel->getActiveSheet()->setCellValue('F'.$cont, $cli['sector']);
            $cont=$cont+1;
        }

        ob_end_clean();
        //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save;
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="Reporte clientes '.date('d/m/Y').'.xls" ');
        header('Cache-Control: max-age=0');

        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));

        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
        ini_restore("max_execution_time");
        ini_restore("max_input_time");
        ini_restore("memory_limit");
    }
    public function importarVehiculos($post){
        $result = [];
        $diccionario = array(
            'denominación'  => 'denominacion',
            'denominacion'  => 'denominacion',
            'código(matrícula)'  => 'matricula',
            'codigo(matricula)'  => 'matricula',
            'código'  => 'matricula',
            'codigo'  => 'matricula',
            'matrícula'  => 'matricula',
            'matricula'  => 'matricula',
            'marca'      => 'marca',
            'modelo'     => 'modelo',
            'año fabricación'     => 'ano',
            'año fabricacion'     => 'ano',
            'año'     => 'ano',
            'serie/vin'  => 'serie',
            'serie'      => 'serie',
            'tipo' => 'tipo');
        if (count($_FILES)) {
//            print_r($_FILES['excel']);die;
            $archivo = $_FILES['excel']['tmp_name'];
            $nombre = $_FILES['excel']['name'];
            $aux = explode('.', $nombre);
            $formato = $aux[count($aux) - 1];
            $inputFileType = 'Excel5';
            if ($formato == 'xlsx') {
                $inputFileType = 'Excel2007';
            }
            $objReader = PHPExcel_IOFactory::createReader($inputFileType);
            $objReader->setReadDataOnly(true);
            if (file_exists($archivo)) {
                $objPHPExcel = $objReader->load($archivo);
//                print('lluegue');die;
                //Obteniendo los datos en un array
                $worksheettoarray = $objPHPExcel->getActiveSheet()->toArray(
                    null, true, true, true
                );
//                print_r($worksheettoarray);die;
                $nombres = array();
                foreach ($worksheettoarray as $i => $arrworksheet) {
                    if (count($nombres)) {
                        $actual = array();
                        foreach ($arrworksheet as $j => $column) {
                            if ($diccionario[trim(strtolower($nombres[$j]))] && $column!='') {
                                $actual[$diccionario[trim(strtolower($nombres[$j]))]]= $column;
                            }
                        }
                        if(count($actual))
                            $result[] = $actual;
                    }
//                    print($i.'->'.$arrworksheet['A']);
                    if ($arrworksheet['A'] && $diccionario[trim(strtolower($arrworksheet['A']))]
                        && count($nombres) == 0) {
                        $nombres = $arrworksheet;
                    }
//                    else{

                }
            }
//            foreach($result as $item){
//            $equipos[$prod->tipo][]=array('denominacion' => $prod->denominacion, 'naturaleza'=> null,
//                'marca' => $prod->codigo?$prod->codigo:$prod->marca, 'modelo' => $prod->modelo, 'contrato'=>null,
//                'cliente'=>$idcliente, 'codigo'=>$prod->matricula, 'serie'=>$prod->serie);
//            $this->integrator->logistica->addIndicadorExterno(array(
//                'equipos'=>$equipos,
//                'idcliente'=>$idcliente
//            ));
//            }
//            $this->integrator->logistica->addIndicadorExterno($params,0,1)
        }
        return array('success' => true, 'count' => count($result),
            'nombres' => $nombres, 'data' => $result);
    }
//    public function obtenerOperaciones($post){
////        print($this->global->Estructura->idestructura);die;
//        if($post['documento']==1){
//            $objDoctrine = Doctrine_Manager::getInstance();
//            $conexionActual = $objDoctrine->getCurrentConnection();
//            $resp = $conexionActual->fetchAll(
//                "SELECT dp.iddoc FROM mod_datosmaestros.dat_documentoprim dp
//                          INNER JOIN mod_datosmaestros.nom_docprim ndp ON ndp.iddocumentos=dp.iddocumentos
//                          INNER JOIN mod_datosmaestros.dat_estructurasubsist es ON es.idestructurasubsist= dp.idestructurasubsist
//                          WHERE ndp.abreviatura='recepcionLog' AND es.idsubsistema=".$post['idsubsistema'].
//                          " AND es.idestructuracomun=".$this->global->Estructura->idestructura
//            );
//        }
////        print('/*'.$resp[0]['iddoc'].'*/');
//        $iddoc=$resp[0]['iddoc']?$resp[0]['iddoc']:null;
//        $data=$this->integrator->datosmaestros->obtenerOperaciones(
//            $this->global->Estructura->idestructura, $post['idsubsistema'], $resp[0]['iddoc'], null, $post['start'], $post['limit']);
//        return $data;
////        return array('success'=>true, 'total'=>$data['total'], 'data'=>$data);
//    }


    public function habilitarClienteProveedor($params){
        try {
//            print(intval($idclienteproveedor));
//            print('/*entraaaa:'.intval($idclienteproveedor).'*/');

            // print_r($params['idclienteproveedorentidad']);die;
            $cliente = Doctrine::getTable('DatClienteProveedorEntidad')->find($params['idclienteproveedorentidad']);

            if ($cliente) {
                $this->obtenerOperaciones($params['habilitar'],$params['idclienteproveedor']);
                //$cliente->habilitado = $params['habilitar'];
                //$cliente->save();
                $clientehabilitar=Doctrine::getTable('DatClienteProveedorHabilitar')
                    ->findOneBy('idclienteproveedorentidad', $cliente->idclienteproveedorentidad);
                if(!$clientehabilitar){
                    $clientehabilitar = new DatClienteProveedorHabilitar();
                }
                $global = ZendExt_GlobalConcept::getInstance();
                $clientehabilitar->idclienteproveedorentidad=$cliente->idclienteproveedorentidad;
                $clientehabilitar->argumento=$params['argumento'];
                $clientehabilitar->idusuario=$global->Perfil->idusuario;
                $clientehabilitar->save();
            }
            return array('code' => -1);
        } catch (Exception $e) {
            throw $e;
        }
    }


    public function obtenerOperaciones($hablitado,$idcliente){


        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $resp = $conexionActual->fetchAll(
            "UPDATE mod_datosmaestros.dat_clienteproveedorentidad
               SET habilitado=$hablitado
               WHERE mod_datosmaestros.dat_clienteproveedorentidad.idclienteproveedor=$idcliente"

        );

    }

    public function getMarcasVehiculo($params){
        try{
            $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
            $where='';
            if($params['denominacion'])
                $where=" WHERE denominacion ILIKE '%".$params['denominacion']."%'";
            $datos=$conexionActual->fetchAll(
                "SELECT denominacion, idmarca, COALESCE(codigo) as codigo FROM mod_datosmaestros.nom_marca ".$where
            );
            return array('success'=>true, 'data'=>$datos);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getModelosVehiculo($params){
        try{
            $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
            $where='';
            if($params['idmarca'])
                $where='WHERE idmarca='.$params['idmarca'];
            if($params['denominacion'])
                $where=" WHERE m.denominacion ILIKE '%".$params['denominacion']."%'";
            $datos=$conexionActual->fetchAll(
                "SELECT m.denominacion, m.idmodelo 
                  FROM mod_datosmaestros.nom_modelo m 
                  LEFT JOIN mod_datosmaestros.dat_nommarcamodelo nm 
                  ON(nm.idmodelo=m.idmodelo) ".$where
            );
            return array('success'=>true, 'data'=>$datos);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getTiposVehiculos($params){
        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
        $where='';
        if($params['denominacion'])
            $where=" WHERE tv.denominacion ILIKE '%".$params['denominacion']."%'";
        $datos=$conexionActual->fetchAll(
            "SELECT tv.* FROM mod_crmclienteproveedor.nom_tipovehiculo tv ".$where
        );
        return array('success'=>true, 'data'=>$datos);
    }

    public function obtenerPaises($params){
        $cond=array();
        if($params['nombrepais']!='')$cond['nombrepais']=$params['nombrepais'];
        return $this->integrator->datosmaestros->getPaises($cond, $params['start'], $params['limit']);
    }

    public function comprobarPeriodoVencimiento($params){
        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
        $datos=$conexionActual->fetchAll(
             "SELECT c.idclientesproveedores, c.nombre, c.codigo, c.idtipo,
                    c.fechafin, (c.fechafin - CURRENT_DATE) as diasrestantes
                FROM mod_datosmaestros.nom_clientesproveedor c
                WHERE c.fechafin - CURRENT_DATE <=".$params['diasaviso'].
             " AND c.enviadocorreo = 0"
        );
        return array('success'=>true, 'data'=>$datos);
    }

    public function marcarCorreoEnviado($params){
        foreach (json_decode($params['ids']) as $idcliente){
            $cliente = Doctrine::getTable('NomClienteproveedor')->find($idcliente);
            $cliente->enviadocorreo = 1;
            $cliente->save();
        };
        return array('success'=>true);
    }

    public function obtenerDocumentos($params){
        try {
            if ($this->testGD()){
                $cliente = Doctrine::getTable('NomClienteproveedor')->find($params['idcliente']);
                $documentos = $this->getContenidoDocumentos($cliente->idespaciotrabajo);

            }
            return array('success'=>true, 'data'=>$documentos);
        } catch (Doctrine_Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function getContenidoDocumentos($idespaciotrabajo)
    {
        try {
            //die('dsfdssdf');
            $resultado = array();
                if ($idespaciotrabajo) {
                    $params["id"] = $idespaciotrabajo;
                    $params["tipoContenido"] = "contenidos";
                    $params["buscar"] = false;
                    $path = getcwd().'/*';
                    $pathnoborrar = getcwd().'/';
                    $files = glob($path); // get all file names
                    $archivonoborrar= $pathnoborrar.'index.php';
                    foreach($files as $file){
                        //print_r($file);die;
                        if(is_file($file))

                            if($file != $archivonoborrar)
                                unlink($file); // delete file
                    }
                    //print_r($params);die;
                    $contenido = $this->_gestordocumental->obtenerContenidos($params)->objectList;
                    //print_r($contenido);die;
                    foreach ($contenido as $doc) {
                        if ($doc->properties['cmis:objectTypeId'] == 'cmis:document') {
                            $temp=explode('/', $doc->id);

                            $params['iddocument'] = explode(';',$temp[count($temp)-1])[0];
                            //$result = $this->getFile($params);
                            $nombre = explode('.', $doc->properties['cmis:name']);
                            if(count($nombre) > 1)
                                array_pop($nombre);
                            $resultado[] = array(
                                'nombre' => implode('', $nombre),
                                'nombrearchivo' => $doc->properties['cmis:name'],
                                'url'    => $doc->id,
                                'idnodo' => $temp[count($temp)-1],
                                'local'  => 0
                            );
                        }
                    }
                }
                //print_r($resultado);die;
                return $resultado;
        } catch (Exception $e) {
            throw $e;
        }
    }


}

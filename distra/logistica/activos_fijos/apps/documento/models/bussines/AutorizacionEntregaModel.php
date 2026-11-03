<?php

/**
 *
 */
class AutorizacionEntregaModel extends DocumentoLogisticaModel
{
    protected $_mComunAFT;
    protected $_logistEstrucUbica;
    protected $_sConfGeneral;
    protected $movModel;

    /**
     *
     */
    public function __construct($parametros = array())
    {
        parent::__construct($parametros);
        $this->_logistEstrucUbica = LogisticaEstructuraUbicHelper::__init();
        $this->_sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $this->_mComunAFT = ComunAFTModel::getInstance();
        $this->movModel = new LogisticaMovimientoModel();
    }

    public function ZendExt_Model($module = null)
    {
        parent::ZendExt_Model($module);
    }

    public function getCargarAreaDestino($parametros)
    {
        $query = new Doctrine_Query();
        $security = ZendExt_Aspect_Security_Sgis::getInstance();
        $datos = $query->select('a.*')
            ->from('DatAutorizo a')
            ->where('a.idoperacion = ?', array($parametros['idoperacion']))
            ->limit(($parametros['limit']) ? $parametros['limit'] : 30)
            ->offset(($parametros['start']) ? $parametros['start'] : 0)
            ->fetchArray();
        foreach ($datos as $index => $deposito) {

            $depositos = $this->_logistEstrucUbica
                ->cargardepositos(
                $deposito['iddestino'], null, null, null, null, $this->uiParams['idtipo'], true
            );
            $datos[$index]['deposito'] = $depositos['depositos'][0]['deposito'];
        }
        return $datos;
    }

    public function getCargarEntidadDestino($parametros)
    {
        $conn = Zend_Registry::get('conexion');
        $selectData = "SELECT dc.idcliente as iddestino, es.denominacion as deposito, dc.iddocumentocliente,"
            . "es.codigo as codigoreup";
        $sqlFrom = " FROM mod_logistica.dat_documentocliente dc
                        inner join mod_estructuracomp.nom_filaestruc f on f.idfila = dc.idcliente
                        inner join  mod_estructuracomp.dat_estructura es on es.idestructura = f.idfila ";

        /* $selectData = " SELECT DISTINCT au.*, es.denominacion as deposito";
          $sqlFrom = " FROM mod_logactivofijotangible.dat_autorizo au
          inner join mod_estructuracomp.nom_filaestruc f on f.idfila = au.iddestino
          inner join  mod_estructuracomp.dat_estructura es on es.idestructura = f.idfila "; */

        $sqlWhere = " where es.idconcepto = 3 and dc.iddocumento = ".$parametros['iddocumento']." ";

        /* if(!$param['idestado']){
          $sqlWhere .= " AND au.idestado = 0";
          } */
        $sqlWhere = $this->getFilter($sqlWhere, $parametros);
        $start = ($parametros['start'] ? $parametros['start'] : 0);
        $limit = ($parametros['limit'] ? $parametros['limit'] : 30);
        if (is_numeric($start) && is_numeric($limit)) {
            $sqlPaginado = " OFFSET($start) LIMIT($limit)";
        } else {
            $sqlPaginado = "";
        }
        $sqlSelectCount = "SELECT count(DISTINCT es.denominacion) as cantidad";
        $total = $conn->fetchAll($sqlSelectCount.$sqlFrom.$sqlWhere);
        $respuesta['total'] = $total[0]['cantidad'];
        $respuesta['datos'] = $conn->fetchAll($selectData.$sqlFrom.$sqlWhere.$sqlPaginado);
        return $respuesta;

        /*
          $datos = $this->getCargarRegNumericos($parametros, 'idoperacion', 'DatAutorizo');
          $security = ZendExt_Aspect_Security_Sgis::getInstance();
          $dominios = $this->getDepositoNotInEntidad();
          print_r($dominios);
          die;
          $index = 0;
          foreach ($datos as $index => $deposito) {
          foreach ($dominios['datos'] as $value) {
          if ($deposito['iddestino'] == $value['id']) {
          $dat = explode('>', $value['text']);
          if (count($dat) == 1) {
          $datos[$index]['deposito'] = $dat[0];
          } else {
          if (count($dat) > 1) {
          $dat = explode('<', $dat[1]);
          $datos[$index]['deposito'] = $dat[0];
          }
          }
          $index++;
          }
          }
          }
          print_r($datos);
          die;
          return $datos; */
    }

    public function getGuardarAreaEntidadDestino($parametros)
    {
        //print_r($parametros);//die;
        $collection = new Doctrine_Collection('DatDocumentoCliente');
        foreach ($parametros['arrayIdDeposito'] as $identidad) {
            $docCliente = new DatDocumentoCliente();
            $docCliente->iddocumento = $parametros['iddocumento'];
            $docCliente->idcliente = $identidad;
            $collection->add($docCliente);
        }
        //print_r($collection->toArray());die;
        $collection->save();

        /*
          if (count($parametros['arrayIdDeposito']) > 0) {
          $colecctionRns = new Doctrine_Collection('DatAutorizo');
          foreach ($parametros['arrayIdDeposito'] as $arrayIdDeposito) {
          $iddestino = Doctrine::getTable('DatAutorizo')->findByDql('iddestino = ', $arrayIdDeposito);
          if (count($iddestino) == 0) {
          $objAutorizo = new DatAutorizo();
          $objAutorizo->synchronizeWithArray($parametros);
          $objAutorizo->iddestino = $arrayIdDeposito;
          $objAutorizo->idoperacion = $this->getOperaciones();
          $colecctionRns->add($objAutorizo);
          }
          }
          $colecctionRns->save();
          } */
    }

    public function getAddRegNumerico($parametros)
    {
        if (count($parametros['arrayregNumerico']) > 0) {
            $colecctionRns = new Doctrine_Collection('DatRegAutorizo');
            foreach ($parametros['arrayregNumerico'] as $regNumerico) {
                $iddestino = Doctrine::getTable('DatRegAutorizo')->findByDql('idregnumerico = ', $regNumerico);
                $datRegNumActivo = Doctrine::getTable("DatRegnumericoActivo")->find($regNumerico);
                $datRegNumActivo->idestadoperacion = 6;

                if (count($iddestino) == 0) {

                    $objRegAutorizo = new DatRegAutorizo();
                    $objRegAutorizo->idregnumerico = $regNumerico;
                    $objRegAutorizo->iddocumentocliente = $parametros['iddocumentocliente'];
                    // $objRegAutorizo->idorigen = $datRegNumActivo->idarearesp;
                    $colecctionRns->add($objRegAutorizo);
                }
                // $datRegNumActivo = Doctrine::getTable("DatRegnumericoActivo")->find($regNumerico);
                $datRegNumActivo->save();
            }
            $colecctionRns->save();
        }
    }

    public function getCargarRegNumericos($parametros, $idwhere, $class) //$parametros, 'iddestino', 'DatRegAutorizo'
    {
        $query = new Doctrine_Query();
        $query->select('a.*')
            ->from("{$class} a");
        if ($parametros[$idwhere]) {
            $query->where("a.{$idwhere} = ?", array($parametros[$idwhere]));
        }
        $query->limit(($parametros['limit']) ? $parametros['limit'] : 30)
            ->offset(($parametros['start']) ? $parametros['start'] : 0);
        $datos = $query->fetchArray();
        return $datos;
    }

    public function getRegNumNomostrar($datos)
    {
        foreach ($datos as $index => $dat) {
            $regnum[$index] = $dat['idregnumerico'];
        }
        return $regnum;
    }

    public function getEliminarAreaEntidadDestino($parametros)
    {

        $coll = new Doctrine_Collection("{$parametros['clas']}");
        foreach ($parametros['arrayid'] as $arrayid) {
            if ($parametros['regnum'] == 'regnum') {
                $query = new Doctrine_Query();
                $query->select('a.idregnumerico')
                    ->from("DatRegAutorizo a")
                    ->where("a.idregnumerico = {$arrayid}");
                $res = $query->fetchArray();
            } else {
                $query = new Doctrine_Query();
                $query->select('a.idregnumerico')
                    ->from("DatRegAutorizo a")
                    ->where("a.iddocumentocliente = {$arrayid}");
                $res = $query->fetchArray();
            }
            if (count($res) > 0) {
                foreach ($res as $regnum) {
                    $datRegNumActivo = Doctrine::getTable("DatRegnumericoActivo")->find($regnum['idregnumerico']);
                    $datRegNumActivo->idestadoperacion = 1;
                    $datRegNumActivo->save();
                }
            }

            $autorizo = Doctrine::getTable("{$parametros['clas']}")
                ->findByDql("{$parametros['id']} = ? ", array($arrayid));
            $coll->add($autorizo);
        }
        $coll->delete();
    }

    public function getDepositoNotInArea($depositos, $parametros)
    {
        $index = 0;
        $query = new Doctrine_Query();
        foreach ($depositos as $dep) {
            $datos = $query->select('a.*')
                ->from('DatAutorizo a')
                ->where('a.iddestino = ?', array($dep['iddeposito']))
                ->fetchArray();
            if (count($datos) == 0) {
                $result[$index] = $dep;
                $index ++;
            }
        }
        return $result;
    }

    public function getCargarRegNumericosAdd($parametros)
    {
        $idnatObjObra = IntegracionNomencladoresModel::NATURALEZA_OBJETODEOBRA;
        $idnatINMUEBLE = IntegracionNomencladoresModel::NATURALEZA_INMUEBLE;
       // $idnatActivos = IntegracionNomencladoresModel::NATURALEZA_ACTIVOS;
        //---$area = implode(',', $parametros['idarearesp']);
        //--$connesp = Zend_Registry::get('conexion');
        //--$selectesp = " SELECT estr.idespecialidad as idespecialidad
        //--FROM mod_estructuracomp.dat_estructura estr
        //--WHERE estr.idestructura IN ($area)";
        //--$respesp = $connesp->fetchAll($selectesp);

        $idespecialidad = $this->global->Estructura->idespecialidad;



        $conn = Zend_Registry::get('conexion');
        $selectData = "SELECT es.denominacion as entidad,esop.idestructuraop, n.idregnumerico, r.nroserie, "
            . "esop.denominacion as arearesp, "
            ."n.nroinventario, n.idarearesp, marca.denominacion || ' - '|| modelo.denominacion as marcamodelo, "
            . "ni.denominacion as denominacion";

        $sqlFrom = " FROM mod_logactivofijotangible.dat_regnumericoactivo n
                
                INNER JOIN mod_logactivofijotangible.dat_registronumerico r ON n.idregnumerico = r.idregnumerico
                INNER JOIN mod_logistica.dat_producto p ON r.idproducto = p.idproducto
                left JOIN mod_estructuracomp.dat_estructura es on es.idestructura = p.idestructuracomun
                left JOIN mod_estructuracomp.dat_estructuraop esop on esop.idestructuraop = p.idestructura

                INNER JOIN mod_datosmaestros.nom_indicadorhoja ih ON p.idindicador = ih.idindicador                
                INNER JOIN mod_datosmaestros.nom_indicador ni ON ih.idindicador = ni.idindicador
                LEFT JOIN mod_datosmaestros.nom_marca marca ON ih.idmarca = marca.idmarca
                LEFT JOIN mod_datosmaestros.nom_modelo modelo ON ih.idmodelo = modelo.idmodelo
                LEFT JOIN mod_datosmaestros.nom_gruposubgrupohoja gsh ON ih.idgruposubgrupo = gsh.idgruposubgrupo ";
        $sqlWhere = " where ni.idnaturaleza Not IN ("
            . "$idnatObjObra,$idnatINMUEBLE) --and es.idespecialidad = $idespecialidad
                and ni.idespecialidad = $idespecialidad";
        
        /*if($parametros['estado'] == 3){
            $sqlWhere .= " and n.idarearesp IN($area)";
        }else{
            $sqlWhere .= " and n.idarearesp Not IN($area)";
        }*/
        if ($parametros['DatRegAutorizo']) {
            $sqlWhere .= " and n.idestadoperacion = 6";
            $sqlFrom .= " INNER JOIN mod_logactivofijotangible.dat_regautorizo ra on r.idregnumerico = ra.idregnumerico";
        } else {
            $sqlWhere .= " and n.idestadoperacion = 1";
        }



        $start = ($parametros['start'] ? $parametros['start'] : 0);
        $limit = ($parametros['limit'] ? $parametros['limit'] : 30);
        if (is_numeric($start) && is_numeric($limit)) {
            $sqlPaginado = " OFFSET($start) LIMIT($limit)";
        } else {
            $sqlPaginado = "";
        }
        $sqlSelectCount = "SELECT count(n.idregnumerico) as cantidad";
        $sqlWhere = $this->getFilter($sqlWhere, $parametros);

        $total = $conn->fetchAll($sqlSelectCount.$sqlFrom.$sqlWhere);
        $respuesta['total'] = $total[0]['cantidad'];
        $respuesta['datos'] = $conn->fetchAll($selectData.$sqlFrom.$sqlWhere.$sqlPaginado);
        return $respuesta;
    }

    public function getDepositoNotInEntidad($parametros)
    {
       
        $conn = Zend_Registry::get('conexion');
        $selectData = " SELECT DISTINCT es.denominacion as deposito, f.idfila as iddestino, es.codigo as codigoreup,
        es.idespecialidad";
        $sqlFrom = " FROM mod_estructuracomp.nom_filaestruc f 
        INNER JOIN mod_estructuracomp.dat_estructura es on es.idestructura = f.idfila";
        $sqlWhere = " where es.idconcepto = 3";

        $sqlGroupBy = " GROUP BY es.denominacion, f.idfila, es.idconcepto, es.codigo, es.idespecialidad ";
        $start = ($parametros['start'] ? $parametros['start'] : 0);
        $limit = ($parametros['limit'] ? $parametros['limit'] : 30);
        if (is_numeric($start) && is_numeric($limit)) {
            $sqlPaginado = " OFFSET($start) LIMIT($limit)";
        } else {
            $sqlPaginado = "";
        }
      
        $sqlWhere = $this->getFilter($sqlWhere, $parametros);
        $sqlSelectCount = "SELECT count(DISTINCT es.denominacion) as cantidad";       
        $total = $conn->fetchAll($sqlSelectCount.$sqlFrom.$sqlWhere);
        $respuesta['total'] = $total[0]['cantidad'];
        
        $respuesta['datos'] = $conn->fetchAll($selectData.$sqlFrom.$sqlWhere.$sqlGroupBy.$sqlPaginado);
        return $respuesta;
    }

    public function getAdicionarDoc($param)
    {
        $query = new Doctrine_Query();
        $documento = parent::adicionarDocumento($param);
        $documento->estado = 0;
        $documento->save();

        /*
          if ($param['arrayIddestino']) {
          foreach ($param['arrayIddestino'] as $value) {
          $obj = new DatDocumentoCliente();
          $obj = new DatAutorizo();
          $datos = $query->select('a.*')
          ->from('DatAutorizo a')
          ->where('a.iddestino = ?', array($value))
          ->fetchArray();
          $iddestino = Doctrine::getTable('DatAutorizo')->find($datos[0]['idautorizo']);
          $iddestino->iddocumento = $documento->iddocumento;
          $iddestino->idestado = 1;
          $iddestino->save();
          }
          } */
        return $documento->iddocumento;
    }

    public function getFilter($sqlWhere, $param)
    {
        if ($param['deposito']) {
            $sqlWhere .= " AND es.denominacion ILIKE '%{$param['deposito']}%'";
        }
        if ($param['arrayIdDepositoNotIn']) {
            $arrayIdDepositoNotIn = $param['arrayIdDepositoNotIn'];
            // print_r($arrayIdDepositoNotIn);die;
            $sqlWhere .= " AND f.idfila NOT IN($arrayIdDepositoNotIn)";
        }
        if ($param['marcamodelo']) {
            $sqlWhere .= " AND (marca.denominacion ILIKE '%{$param['marcamodelo']}%' "
                ."or modelo.denominacion ILIKE '%{$param['marcamodelo']}%')";
        }
        if ($param['denominacion']) {
            $sqlWhere .= " AND ni.denominacion ILIKE '%{$param['denominacion']}%' ";
        }
        if ($param['idestado'] == "0") {
            $sqlWhere .= " AND au.idestado = {$param['idestado']}";
        }
        if ($param['codigoreup']) {            
            $sqlWhere .= " AND es.codigo = '{$param['codigoreup']}'";           
        }
        if ($param['iddocumentocliente']) {
            $sqlWhere .= " AND ra.iddocumentocliente = {$param['iddocumentocliente']}";
        }
        if ($param['nroinventario']) {
            $sqlWhere .= " AND n.nroinventario ILIKE '%{$param['nroinventario']}%'";
        }
        if ($param['nroserie']) {
            $sqlWhere .= " AND r.nroserie ILIKE '%{$param['nroserie']}%'";
        }
        if ($param['arearesp']) {//esop.denominacion
            $sqlWhere .= " AND esop.denominacion ILIKE '%{$param['arearesp']}%'";
        }
        if ($param['nrodoc'] || $param['criterio']) {
            if ($param['criterio']) {
                $param['nrodoc'] = $param['criterio'];
            }
            $sqlWhere .= " AND d.nrodoc = {$param['nrodoc']}";
        }
        if ($param['numeroref']) {
            $sqlWhere .= " AND d.numeroref  = {$param['numeroref']}";
        }
        if ($param['entidad']) {
            $sqlWhere .= " AND es.denominacion ILIKE '%{$param['entidad']}%'";
        }
        if($param['comparaciones']){
            foreach ($param['comparaciones'] as $comparacion){
                 $sqlWhere .= " AND es.codigo {$comparacion['signo']} '{$comparacion['valor']}'";     
            }
        }

        return $sqlWhere;
    }

    public function getOperaciones()
    {

        $arrIdesOper = $this->_mComunAFT->getArrayIdOperacionesUtilizadas(
            false, false, array('OPER_TRASLADO_EXTER'/* , 'OPER_TRASLADO_INTER' */), false
        );
        foreach ($arrIdesOper as $index => $idOper) {
            $documento = $this->_sConfGeneral->obtenerOperaciones(
                $this->_idestructura, LogisticaGlobal::SUBSISTEMA_AFT, null, $idOper
            );
            $datos[$index]['idoperacion'] = $idOper;
            $datos[$index]['denominacion'] = $documento[0]['denominacion'];
            $datos[$index]['codigooperacion'] = $documento[0]['codigooperacion'];
        }
        return $datos[0]['idoperacion'];
    }

    public function cargardocumentos($parametros)
    {
        $alias = "entregaLog";
        $idsubsistema = $this->global->Subsistema->idsubsistema;
        $cEstructura = 'Estructura';
        $idestructura = ZendExt_GlobalConcept::getInstance()->$cEstructura->idestructura;
        $objDocPrim = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
            $alias, $idestructura, $idsubsistema
        );
        $iddoc = $objDocPrim->iddoc;
        $conndell = Zend_Registry::get('conexion');
        $dell = " DELETE FROM 
                mod_logistica.dat_documento 
                WHERE iddoc = $iddoc and estado = 0 ";

        $conndell->execute($dell);

        $conn = Zend_Registry::get('conexion');
        $selectData = "SELECT DISTINCT d.observaciones, d.estado,d.iddocumento, d.nrodoc, d.fechacontable, 
            d.numeroref, s.nombreusuario as usuario                    
                     ";
        $sqlFrom = " FROM mod_logistica.dat_documento d        
                     LEFT JOIN mod_logistica.dat_documentocliente c on c.iddocumento = d.iddocumento
                     LEFT JOIN mod_logactivofijotangible.dat_regautorizo r on r.iddocumentocliente = c.iddocumentocliente
                     INNER JOIN mod_seguridad.seg_usuario s on s.idusuario = d.idusuario ";

        $sqlWhere = "  where d.idestructuracomun = {$idestructura} and d.iddoc = {$iddoc} ";

        $sqlWhere = $this->getFilter($sqlWhere, $parametros);
        $start = ($parametros['start'] ? $parametros['start'] : 0);
        $limit = ($parametros['limit'] ? $parametros['limit'] : 30);
        if (is_numeric($start) && is_numeric($limit)) {
            $sqlPaginado = " OFFSET($start) LIMIT($limit)";
        } else {
            $sqlPaginado = "";
        }
        $orderby = " GROUP BY d.nrodoc, d.fechacontable, d.numeroref, s.nombreusuario,d.estado,"
            ." d.iddocumento, d.observaciones";
        $sqlSelectCount = "SELECT count(DISTINCT d.iddocumento) as cantidad";
        $total = $conn->fetchAll($sqlSelectCount.$sqlFrom.$sqlWhere);
        $respuesta['total'] = $total[0]['cantidad'];
        $respuesta['datos'] = $conn->fetchAll($selectData.$sqlFrom.$sqlWhere.$orderby.$sqlPaginado);

        foreach ($respuesta['datos'] as $key => $dat) {
            $conndos = Zend_Registry::get('conexion');
            $sqlFrom = " SELECT                
                    count(r.iddocumentocliente)as activos,
                    count(DISTINCT c.idcliente) as clientes 
                    FROM mod_logistica.dat_documento d        
                    LEFT JOIN mod_logistica.dat_documentocliente c on c.iddocumento = d.iddocumento
                    LEFT JOIN mod_logactivofijotangible.dat_regautorizo r on r.iddocumentocliente =
                    c.iddocumentocliente
                     INNER JOIN mod_seguridad.seg_usuario s on s.idusuario = d.idusuario   where d.idestructuracomun
 = $idestructura and d.iddoc = $iddoc and d.iddocumento = {$dat['iddocumento']}";
            $result = $conndos->fetchAll($sqlFrom);
            $respuesta['datos'][$key]['activos'] = $result[0]['activos'];
            $respuesta['datos'][$key]['clientes'] = $result[0]['clientes'];
        }
        return $respuesta;
    }

    public function getAceptarDoc($param)
    {
        $datDoc = Doctrine::getTable("DatDocumento")->find($param['iddocumento']);
        $datDoc->estado = 1;
        if ($param['observaciones']) {
            $datDoc->observaciones = $param['observaciones'];
        }
        $datDoc->save();
    }

    public function getEliminarDoc($param)
    {
        $this->getSqlGenral($param, "eliminar");
        /* foreach ($param['iddocumento'] as $doc) {
          $datDoc = Doctrine::getTable("DatDocumento")->find($doc);
          $conn = Zend_Registry::get('conexion');
          $selectData = "SELECT DISTINCT r.idregnumerico";
          $sqlFrom = " FROM mod_logistica.dat_documento d
          INNER JOIN mod_logistica.dat_documentocliente c on c.iddocumento = d.iddocumento
          INNER JOIN mod_logactivofijotangible.dat_regautorizo r on
          r.iddocumentocliente = c.iddocumentocliente";

          $sqlWhere = "  where d.iddocumento IN ($doc)";
          $respuesta = $conn->fetchAll($selectData.$sqlFrom.$sqlWhere);
          $respuesta = $conn->fetchAll($selectData.$sqlFrom.$sqlWhere);
          foreach ($respuesta as $regnum) {
          $datRegNumActivo = Doctrine::getTable("DatRegnumericoActivo")->find($regnum['idregnumerico']);
          $datRegNumActivo->idestadoperacion = 1;
          $datRegNumActivo->save();
          }
          $datDoc->delete();
          } */
    }

    public function getConfirmarDoc($param)
    {
        $result = $this->getSqlGenral($param, "confirmar");

        return $result;
    }

    public function getAnularDoc($param)
    {
        foreach ($param['iddocumento'] as $doc) {
            $datDoc = Doctrine::getTable("DatDocumento")->find($doc);
            $datDoc->estado = 1;
            $datDoc->save();
        }
    }

    public function getSqlGenral($param, $activar)
    {
        $ban = true;
        foreach ($param['iddocumento'] as $doc) {
            $conn = Zend_Registry::get('conexion');
            $selectData = "SELECT DISTINCT r.idregnumerico, r.iddocumentocliente, c.idcliente";
            $sqlFrom = " FROM mod_logistica.dat_documento d        
                     INNER JOIN mod_logistica.dat_documentocliente c on c.iddocumento = d.iddocumento
                     INNER JOIN mod_logactivofijotangible.dat_regautorizo r on 
                     r.iddocumentocliente = c.iddocumentocliente";

            $sqlWhere = "  where d.iddocumento IN ($doc)";
            $respuesta = $conn->fetchAll($selectData.$sqlFrom.$sqlWhere);

            if ($activar == 'eliminar' && $param['modificar'] != "modificar") {
                $datDoc = Doctrine::getTable("DatDocumento")->find($doc);

                foreach ($respuesta as $regnum) {
                    $datRegNumActivo = Doctrine::getTable("DatRegnumericoActivo")->find($regnum['idregnumerico']);
                    $datRegNumActivo->idestadoperacion = 1;
                    $datRegNumActivo->save();
                }
                $datDoc->delete();
            }
            if ($activar == 'confirmar') {
                if (count($respuesta) == 0) {
                    $ban = false;
                } else {
                    $datDoc = Doctrine::getTable("DatDocumento")->find($doc);
                    $datDoc->estado = 2;
                    $datDoc->save();
                }
            }
        }
        return $ban;
    }

    public function getBuscarRegNum($iddocumento)
    {

        // Buscando los datos
        $regNumActService = new RegNumActivoService();
        new DatRegAutorizo();
        $sqlActivo = new Doctrine_Query();
        $sqlActivo->select("rn.*")
            ->from("DatRegnumerico rn")
            ->innerJoin("rn.DatRegnumericoActivo rna");

        $select = $regNumActService->getSelectFilesDatRegNumActivo('rna', false);
        $sqlActivo->addSelect($select);

        $sqlActivo = $regNumActService->getJoinRegNumericoPlugin($sqlActivo, 'rna', 'rnap', false);

        $sqlActivo->innerJoin("rn.DatProductoLogistica dp");
        $sqlActivo->innerJoin("rn.DatRegAutorizo rauto");
        $sqlActivo->innerJoin("rauto.DatDocumentoCliente ddc");

        $sqlActivo->addSelect("dp.idproducto as idproducto, dp.idindicador as idprod, dp.idestructuracomun as idestructuracomun");
        $sqlActivo->addSelect("ddc.idcliente as iddestino");


        $sqlActivo->where("ddc.iddocumento = ?", array($iddocumento));

        $rn = $sqlActivo->orderBy("ddc.idcliente, rna.idarearesp, dp.idproducto")->fetchArray();
        //print_r($rn);//die;
        return $rn;


        /*
          $conn = Zend_Registry::get('conexion');

          $selectData = "SELECT rn.idproducto, rna.*
          FROM mod_logistica.dat_documento d
          LEFT JOIN mod_logistica.dat_documentocliente c on c.iddocumento = d.iddocumento
          LEFT JOIN mod_logactivofijotangible.dat_regautorizo r on r.iddocumentocliente = c.iddocumentocliente
          INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = r.idregnumerico
          INNER JOIN mod_logactivofijotangible.dat_registronumerico rn on rn.idregnumerico = rna.idregnumerico
          where d.iddocumento = {$value['iddocumento']} and r.iddocumentocliente = {$value['iddocumentocliente']}";

          $respuesta = $conn->fetchAll($selectData);
          return $respuesta; */
    }

    public function getAprobarDoc($param)
    {        
        $docActivoModel = new DocumentoActivoModel();
        $movService = new MovimientoService();
        $producto = new LogisticaProductoModel();
        $docLogModel = new DocumentoLogisticaModel(array('alias' => 'MMAFT', 'noexception' => true,
            'subsistema' => LogisticaGlobal::SUBSISTEMA_AFT));
        $codigo = 'OPER_TRASLADO_EXTER';
       
        $datDoc = Doctrine::getTable("DatDocumento")->find($param['iddocumento']);
        $datDoc->estado = 3;
        $datDoc->nrodoc = $this->devolverUltimoNumeroDoc();           
        $datDoc->save();
     
        $cronologia = $docLogModel->establecerCronologia($param['iddocumento'][0]);         
        $this->movModel->aprobarCronologiaProductos($param['iddocumento'][0], $cronologia);

        new DatDocTransferenciaEntidades();
        /* $operTraslado = $this->_mComunAFT->getDatosInterfazOperacion(false, false, $codigo, false, $idEstructura);        
          if (count($operTraslado) == 0) {
          die("Lanzar excepcion que no esta configurado el documento traslado externo");
          } */
        //$producto = Doctrine::getTable('DatProductoLogistica')->find($regNumerico->idproducto);
        //  foreach ($param['iddocumento'] as $key => $value) {

       
        $rnNumericos = $this->getBuscarRegNum($param['iddocumento'][0]);
        $cant = count($rnNumericos);
        if ($cant > 0) {

            $iddestino = $rnNumericos[0]['iddestino'];
            $idareaorigen = $rnNumericos[0]['idarearesp'];
            $identidadorigen = $rnNumericos[0]['idestructuracomun'];
            $arrRnAux = array();

            $i = $j = $y = 0;
            while ($i < $cant) {
                if ($rnNumericos[$i]['iddestino'] == $iddestino && $rnNumericos[$i]['idarearesp'] = $idareaorigen) {
                    $arrRnAux[$j][$y] = $rnNumericos[$i];
                    $i++;
                    $y++;
                } else {
                    $j++;
                    $y = 0;
                    // Reasigno los valores para crear el documento
                    $iddestino = $rnNumericos[$i]['iddestino'];
                    $idareaorigen = $rnNumericos[$i]['idarearesp'];
                    $identidadorigen = $rnNumericos[$i]['idestructuracomun'];
                }
            }

            $collectionRegNumActivo = new Doctrine_Collection('DatRegnumerico');
            foreach ($arrRnAux as $key => $rns) {
                $iddestino = $rns[0]['iddestino'];
                $idareaorigen = $rns[0]['idarearesp'];
                $identidadorigen = $rns[0]['idestructuracomun'];

                $operTraslado = $this->_mComunAFT->getDatosInterfazOperacion(false, false, $codigo, false,
                    $identidadorigen);
                if (count($operTraslado) == 0) {

                    // Buscar la denominacion de la entidad y mostrar el nombre de la entidad en la excepcion
                    die("Lanzar excepcion que no esta configurado el documento traslado externo");
                }

                $paramTraslado = array(
                    'iddoc' => $operTraslado[0]['iddoc'],
                    'idoperacion' => $operTraslado[0]['idnomoperaciones'],
                    'idestructuracomun' => $idareaorigen,
                    'observaciones' => 'Traslado a partir de autorizacion de entrega'
                );

                $docTrasl = $docActivoModel->addActivoDoc($paramTraslado);
                $docTrasl->estado = 2;
                $docTrasl->nrodoc = $docTrasl->numeroref;

                $docTrasl->DatDocTransferenciaEntidades->identidaddestino = $iddestino;

                // Le agrego los movimientos
                $docTrasl = $movService->crearMovimiento($rns, $docTrasl);

                // Adiciono el documento al collection
                $docTrasl->save();

                // Apruebo el documento
                $cronoTrasl = $docLogModel->aprobarDocumento($docTrasl->iddocumento, true);
                $producto->getMovimientoModel()->aprobarCronologiaProductos($docTrasl->iddocumento, $cronoTrasl);

                // Modificar el rn y el dat_producto
                $idindicador = null;
                foreach ($rns as $rn) {
                    $regNumerico = Doctrine::getTable('DatRegnumerico')->find($rn['idregnumerico']);
                    if ($idindicador != $rn['idprod']) {
                        $producto = Doctrine::getTable('DatProductoLogistica')->find($rn['idproducto']);
                        $query = new Doctrine_Query();
                        $query->select('p.idproducto as idproducto');
                        $query->from('DatProductoLogistica p');
                        $query->where('p.idestructuracomun = ? and p.idindicador = ? and p.idestructura = ?',
                            array($iddestino, $producto->idindicador, $identidadorigen));
                        $idProducto = $query->fetchOne()->idproducto;
                        if (!$idProducto) {
                            $prod = new DatProductoLogistica();
                            $prod->idindicador = $producto->idindicador;
                            $prod->idestructura = $identidadorigen;
                            $prod->idestructuracomun = $iddestino;
                            $prod->save();
                            $idProducto = $prod->idproducto;
                        }
                    }

                    $regNumerico->idproducto = $idProducto;
                    $regNumerico->DatRegnumericoActivo->idarearesp = $iddestino;
                    $regNumerico->DatRegnumericoActivo->idestadoperacion = 6;
                    $collectionRegNumActivo->add($regNumerico);
                }
            }
            $collectionRegNumActivo->save();
            return true;
        } else {
            return false;
        }
    }
    public function devolverUltimoNumeroDoc()
    {
        $alias = "entregaLog";
        $idsubsistema = $this->global->Subsistema->idsubsistema;
        $cEstructura = 'Estructura';
        $idestructura = ZendExt_GlobalConcept::getInstance()->$cEstructura->idestructura;
        $objDocPrim = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
            $alias, $idestructura, $idsubsistema
        );
        $iddoc = $objDocPrim->iddoc;
        $conn = Zend_Registry::get('conexion');
        $sql= " SELECT MAX(d.nrodoc) as numero
                FROM mod_logistica.dat_documento d         
                where d.iddoc = $iddoc ";
        $nro = $conn->fetchAll($sql);       
        return $nro[0]["numero"] + 1; 
    }

}

<?php

    /**
     * @class      TarjetaMedicamentoModel
     * @package    Farmacia
     * @subpackage farmacia
     * @author     Daniel Arias Espinosa
     * @copyright  XETID
     * @version    1.0
     */
    class TarjetaMedicamentoModel extends DocumentoLogisticaModel
    {

        private $configuracionGeneral, $rrhhServices;

        public function __construct($datosDoc)
        {
            parent::__construct($datosDoc);
            $this->configuracionGeneral = ServiciosConfiguracionGeneralHelper::__init();
        }

        /**
         * @param array $params
         *
         * @return array
         */
        public function cargarTarjetas($params = array())
        {
            $limit = ($params['start']) ? " OFFSET {$params['start']}" : " OFFSET 0 ";
            if ($params['limit']) {
                $limit .= " LIMIT {$params['limit']}";
            }
            $subSql = "(Select count(pp.idproductotarjetamedicamento)
            FROM mod_logfarmacia.dat_productotarjetamedicamento pp
            WHERE pp.idtarjetamedicamento = tm.idtarjetamedicamento) as cantidadproductos ";
            $subSqlDatosNull = "(Select count(ppn.idproductotarjetamedicamento)
            FROM mod_logfarmacia.dat_productotarjetamedicamento ppn
            WHERE (ppn.dosis is null OR ppn.dosis = 0 OR ppn.fechaemision is null OR ppn.fechaexpiracion is null)
                AND  ppn.idtarjetamedicamento = tm.idtarjetamedicamento) as datosnull ";
            $sql = " SELECT d.*, tm.*, dvc.*, su.nombreusuario as creadopor, sua.nombreusuario as aprobadopor,
            dvc.numeroidentidad, tm.area, tm.consultoriomedico, dvc.idprovincia as idprov, dvc.idmunicipio as idmun,
            dvc.direccion,d.nrodoc as nrotarjeta, d.numeroref as numeroref, COUNT(*) OVER() as total,
            {$subSql}, {$subSqlDatosNull} ";
            $from = " FROM mod_logistica.dat_documento d
                 INNER JOIN mod_logfarmacia.dat_tarjetamedicamento tm ON tm.idtarjetamedicamento = d.iddocumento
                 INNER JOIN mod_logpuntoventa.dat_ventacliente dvc ON dvc.idventacliente = tm.idpaciente
                 LEFT JOIN mod_seguridad.seg_usuario su ON d.idusuario = su.idusuario
                 LEFT JOIN mod_seguridad.seg_usuario sua ON d.aprobadopor = sua.idusuario
                 ";
            $where = " WHERE (d.idestructuracomun = {$this->idestructuracomun})";
            $this->filtros($params, $where, $from);
            $orderBy = " ORDER BY d.numeroref DESC  ";
            $conn = Zend_Registry::get('conexion');
            $result = $conn->fetchAll($sql.$from.$where.$orderBy.$limit);
            $total = (count($result)) ? $result[0]['total'] : 0;
            return array('datos' => $result, 'cantidad' => $total);
        }

        public function filtros($params, &$where, &$from)
        {
            if ($params['estado'])
            {
                if (is_array($params['estado']))
                {
                    $params['estado'] = implode(",", $params['estado']);
                }
                $where .= " AND d.estado in ({$params['estado']}) ";
            }
            $estadosExcluir = "".EstadoDocumentoModel::ESTADO_CANCELADO.",".EstadoDocumentoModel::ESTADO_ELIMINADO.",".EstadoDocumentoModel::ESTADO_ANULADO.",".EstadoDocumentoModel::ESTADO_CANCELADO_DUPLICADO;
            $where .= " AND d.estado not in ($estadosExcluir)";
            if ($params['criterio'])
            {
                if (is_numeric($params['criterio']))
                {
                    $params['nrodoc'] = $params['criterio'];
                }
                else
                {
                    $params['nrodoc'] = -1;
                }
                unset($params['criterio']);
            }

            if ($params['nrodoc'])
            {
             $where .= " AND d.numeroref = {$params['nrodoc']} ";
            }
            if ($params['cipaciente'])
            {
             $where .= " AND dvc.numeroidentidad = '{$params['cipaciente']}' ";
            }
            if($params['nrotarjeta']) {
                $where .= " AND d.nrodoc = {$params['nrotarjeta']} ";
            }
            if ($params['iddocumento'])
            {
                $where .= " AND d.iddocumento = ({$params['iddocumento']}) ";
            }
            if ($params['aprobadopor'])
            {
                $where .= " AND d.aprobadopor = {$params['aprobadopor']} ";
            }
            if ($params['creadopor'])
            {
                $where .= " AND d.idusuario = {$params['creadopor']} ";
            }
            if ($params['fechainicio'])
            {
                $params['fechainicio'] = substr($params['fechainicio'], 0, 10);
                $where .= " AND d.fechacontable >='{$params['fechainicio']}' ";
            }
            if ($params['fechafin'])
            {   $params['fechafin'] = substr($params['fechafin'], 0, 10);
                $where .= " AND d.fechacontable <='{$params['fechafin']}' ";
            }
            if ($params['fechaemision'] || $params['fechaexpiracion'])
            {
                $from .= " INNER JOIN mod_logfarmacia.dat_productotarjetamedicamento ptm
                ON ptm.idtarjetamedicamento = tm.idtarjetamedicamento ";
                if ($params['fechaemision'])
                {
                    $params['fechaemision'] = substr($params['fechaemision'], 0, 10);
                    $where .= " AND ptm.fechaemision ='{$params['fechaemision']}' ";
                }
                if ($params['fechaexpiracion'])
                {
                    $params['fechaexpiracion'] = substr($params['fechaexpiracion'], 0, 10);
                    $where .= " AND ptm.fechaexpiracion ='{$params['fechaexpiracion']}' ";
                }
            }
            if ($params['idindicador']){
                $where .= " AND tm.idtarjetamedicamento IN (Select ptm.idtarjetamedicamento
                from mod_logfarmacia.dat_productotarjetamedicamento ptm
                where ptm.idindicador = {$params['idindicador']}) ";
            }
            if ($params['nombre']){
                $where .= " AND dvc.nombre ilike '%{$params['nombre']}%' ";
            }

            return $where;
        }

        public function adicionarTarjetaMedicamento($params)
        {
            $this->objectHelper->unsetNullValues($params['data']);
            $data = $params['data'];
            $resultado = DatVentacliente::obtenerDatVentaClienteDadoCI($data['numeroidentidad']);
            $obj = new DatVentacliente();
            if(!empty($resultado)){
                $obj->assignIdentifier($resultado[0]['idventacliente']);
            }
            /*
            if ($data['idventacliente']) {
                $obj->assignIdentifier($data['idventacliente']);
            }*/
            $obj->synchronizeWithArray($data);
                try{
                    $obj->save();
                }catch(Doctrine_Connection_Pgsql_Exception  $e){
                    if($e->getCode()=='23505'){
                        throw new LogisticaException('LOG_LB_FARMACIA_001');
                    }
                }catch(Doctrine_Exception  $e){
                    if($e->getCode()=='23505'){
                        throw new LogisticaException('LOG_LB_FARMACIA_001');
                    }
                }catch(Exception  $e){
                    if($e->getCode()=='23505'){
                        throw new LogisticaException('LOG_LB_FARMACIA_001');
                    }
                }
            $datosDoc = $obj->toArray();
            if (count($datosDoc)){
                $params['idpaciente'] = $datosDoc['idventacliente'];
            }

            if ($this->validarExistenciaDocumento($params, $data))
            {
                $this->objectHelper->unsetNullValues($data);
                $obj = new DatTarjetaMedicamento();
                $doc = $this->adicionarDocumento($data);
                //usando la fecha contable de incentario
                $fecha = $this->configuracionHelper->getFechaContableSubsistemaObj($this->idestructuracomun, LogisticaGlobal::SUBSISTEMA_INV);
                $anno = explode('/', $fecha->fecha);
                $doc->anno = ($anno[2]) ? $anno[2] : date('Y');
                $doc->fechacontable = $fecha->fecha;
                $doc->save();
                $data['idpaciente'] = $params['idpaciente'];
                if ($data['iddocumento'])
                {
                    $data['idtarjetamedicamento'] = $data['iddocumento'];
                    $obj->assignIdentifier($data['idtarjetamedicamento']);
                }
                else
                {
                    $data['idtarjetamedicamento'] = $obj->idtarjetamedicamento = $doc->iddocumento;
                }
                $obj->synchronizeWithArray($data);
                $obj->save();
                $params['iddocumento'] = $doc->iddocumento;
                $this->adicionarProductosTarjeta($params);
                $prueba=$this->cargarTarjetas(array('iddocumento' => $doc->iddocumento));
               return array('datos'=>$prueba['datos'][0],'idtarjetamedicamento'=>$data['idtarjetamedicamento']);
            }
            else
            {
                return array('pacientecontarjeta' => 1);
            }
        }

        /*
         * @Descripcion metodo para verificar si se puede guardar el documento al cliente en cuestion
         * @param $objDocPacientes
         * @param $data
         */
        public function validarExistenciaDocumento($params, $data)
        {
            $objDocPacientes = Doctrine::getTable('DatTarjetaMedicamento')->findBy('idpaciente', $params['idpaciente'], Doctrine_Core::HYDRATE_ARRAY);
            $cant = count($objDocPacientes);

            if ($cant == 2)
            {//saber cual de los dos documentos es el q estoy modificando
                if ($objDocPacientes[0]['idtarjetamedicamento'] == $data['idtarjetamedicamento'])
                {
                    $index = 1;
                }
                else if ($objDocPacientes[1]['idtarjetamedicamento'] == $data['idtarjetamedicamento'])
                {
                    $index = 0;
                }
                else $index = -1;
            }

            if (!count($objDocPacientes) //si no hay doc con ese paciente
                || //Si hay 1 doc pero es el que estoy modificando
                (count($objDocPacientes) == 1 && ($data['idtarjetamedicamento'] && $objDocPacientes[0]['idtarjetamedicamento'] == $data['idtarjetamedicamento'] // o no es el que estoy modificando pero uno es retroviral y el otro no
                        || ($objDocPacientes[0]['idtarjetamedicamento'] != $data['idtarjetamedicamento'] && $objDocPacientes[0]['retrovirales'] != $data['retrovirales']))) //si hay dos y uno es el que estoy modificando que el valor de retroviral sea distinto % ellos
                || ($index > -1 && $objDocPacientes[$index]['retrovirales'] != $data['retrovirales']))
            {
                return true;
            }
            return false;
        }

        public function cargarProductosTarjeta($params)
        {
            $this->actualizarexpiracion();
            $where = $sql = $sql = $orderBy = "";
            if ($params['idtarjetamedicamento'])
            {
                $sql = " SELECT distinct pt.*, tm.*, (case when ni.numeropieza is null or length(ni.numeropieza) = 0 then ni.codigo else ni.numeropieza end) as codigo, ni.denominacion  ";
                $from = " FROM mod_logfarmacia.dat_productotarjetamedicamento pt
                  --INNER JOIN mod_logfarmacia.conf_cuadrobasico cb on pt.idcuadrobasico = cb.idcuadrobasico
                  INNER JOIN mod_logfarmacia.dat_tarjetamedicamento tm ON pt.idtarjetamedicamento = tm.idtarjetamedicamento
                  INNER join mod_datosmaestros.nom_indicador ni on ni.idindicador = pt.idindicador
                  LEFT join mod_logistica.dat_producto pd on pd.idindicador = ni.idindicador ";
                $where = " WHERE (tm.idtarjetamedicamento = {$params['idtarjetamedicamento']}) ";
                $orderBy = "ORDER BY pt.idproductotarjetamedicamento DESC  ";

                if($params['criterio']){
                    $where .=  " AND (ni.denominacion ilike '%{$params['criterio']}%' or ni.codigo ilike '%{$params['criterio']}%' OR ni.numeropieza ilike '%{$params['criterio']}%') ";
                }

                $conn = Zend_Registry::get('conexion');
                $result = $conn->fetchAll($sql.$from.$where.$orderBy);
                return array('datos' => $result, 'cantidad' => count($result));
            }
            else{
                $sql = "SELECT DISTINCT ni.idindicador, ni.denominacion ";
                $from = " FROM mod_logfarmacia.dat_productotarjetamedicamento pt
			inner join mod_logfarmacia.dat_tarjetamedicamento tm ON pt.idtarjetamedicamento = tm.idtarjetamedicamento
			inner join mod_logistica.dat_documento d ON tm.idtarjetamedicamento = d.iddocumento
			left join mod_logfarmacia.conf_cuadrobasico cb on pt.idcuadrobasico = cb.idcuadrobasico
			left join mod_datosmaestros.nom_indicador ni on ni.idindicador = pt.idindicador
			left join mod_logistica.dat_producto pd on pd.idindicador = ni.idindicador";
                //// la tabla paciente tiene id paciente que no se utilizan......
                /*Se cambia a left la union con conf_cuadrobasico, hasta que se defina si se va a utilizar este o no, para que devuelva productos la busqueda avanzada y se pueda filtrar, tambien se cambia la union con nom_indicador para que en vez de unir con el cuadro basico se una directamente con los productos del tarjeton*/
                $where = " WHERE d.idestructuracomun = '{$this->idestructuracomun}'  ";
                $conn = Zend_Registry::get('conexion');
                $result = $conn->fetchAll($sql.$from.$where);

                return array('datos' => $result, 'cantidad' => count($result));

            }

        }

        public function actualizarexpiracion()
        {

            $configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
            $fecha = $configuracionHelper->getFechaContableSubsistema($this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FARMACIA);
            $update = "UPDATE mod_logfarmacia.dat_productotarjetamedicamento pe SET aprobado = 2
			WHERE pe.fechaexpiracion < '{$fecha}'";
            $conn = Zend_Registry::get('conexion');
            $conn->execute($update);
        }

        public function adicionarProductosTarjeta($params)
        {
            $this->objectHelper->unsetNullValues($params['productos']);
            if ($params['productos'])
            {
                $colection = new Doctrine_Collection("DatProductoTarjeta");
                foreach ($params['productos'] as $prod)
                {
                    $this->objectHelper->unsetNullValues($prod);
                    $prod['idtarjetamedicamento'] = $params['iddocumento'];
                    $existe = Doctrine::getTable('DatProductoTarjeta')->findByDql('idtarjetamedicamento = ? and idindicador = ?', array(
                        $params['iddocumento'], $prod['idindicador']
                    ));
                    if (!count($existe)) {
                        $obj = new DatProductoTarjeta();
                        if ($prod['idproductotarjetamedicamento'])
                        {
                            $obj->assignIdentifier($prod['idproductotarjetamedicamento']);
                        }
                        $obj->synchronizeWithArray($prod);
                        $colection[] = $obj;
                    }
                }
                if (count($colection) > 0)
                    $colection->save();
            }
        }

        public function eliminarProductosTarjeta($params)
        {
            $dql = Doctrine_Query::create();
            $dql->delete("DatProductoTarjeta dpt")->whereIn("idproductotarjetamedicamento ", $params)->execute();
        }

        public function aprobarTarjetas($id)
        {
            $update = " UPDATE mod_logfarmacia.dat_productotarjetamedicamento SET aprobado = 1
			WHERE idtarjetamedicamento = {$id}";
            $conn = Zend_Registry::get('conexion');
            $conn->execute($update);
            return $this->aprobarDocumento($id);
        }

        public function aprobarProducto($id)
        {
            $obj = new DatProductoTarjeta();
            $obj->assignIdentifier($id);
            $obj->aprobado = 1;
            $obj->save();
        }

        public function cargarEntregaProducto($params)
        {
            $where = " ep.idproductotarjetamedicamento = -1 ";
            if($params['idproductotarjetamedicamento']){
                $where = " ep.idproductotarjetamedicamento = {$params['idproductotarjetamedicamento']}";
            }
            /*$sql = "select distinct vc.idventacliente, vp.cantidad as cantidadentregada,
                    v.fechaventa as fechaentrega, v.vendedor as entregadapor
                    from mod_logpuntoventa.dat_ventacliente vc
                    inner join mod_logpuntoventa.dat_ventas v on v.idpersona = vc.idventacliente
                    inner join mod_logpuntoventa.dat_ventaproducto vp on vp.idventas = v.idventas
                    where vc.idventacliente = {$params['idventacliente']} ";*/
            $sql = "select ep.* from mod_logfarmacia.dat_entregaproducto ep 
                    where {$where}";
            $conn = Zend_Registry::get('conexion');
            $result = $conn->fetchAll($sql);
            return array('datos' => $result, 'cantidad' => count($result));
        }

        public function cargarAllCuadroBasico($params)
        {
            $params['estructurahija'] = true;
            $modeloCB = new ConfiguracionFarmaciaModel();
            $params['damesql'] = true;
            $objSql = $modeloCB->cargarCuadroBasico($params);
            $excluir = Zend_Json::decode($params['excluir']);
            $excluir = implode(",", $excluir);

            if ($excluir)
            {
                $objSql['where'] .= " AND cb.idcuadrobasico not in ({$excluir}) ";
            }
            if ($params['idtarjetamedicamento'])
            {
                $objSql['where'] .= " AND cb.idcuadrobasico NOT IN
              (SELECT ptm.idcuadrobasico
              FROM mod_logfarmacia.dat_productotarjetamedicamento ptm
              WHERE ptm.idtarjetamedicamento IN
              (SELECT tm.idtarjetamedicamento
              FROM mod_logfarmacia.dat_tarjetamedicamento tm
              where tm.idpaciente IN
              (SELECT t.idpaciente
              FROM mod_logfarmacia.dat_tarjetamedicamento t
               WHERE t.idtarjetamedicamento ={$params['idtarjetamedicamento']})))

            AND usd.idtipodispensacion = 3";
            }
            if($params['criterio']){
                $where .=  " AND (ni.denominacion ilike '%{$params['criterio']}%' or ni.codigo ilike '%{$params['criterio']}%' OR ni.numeropieza ilike '%{$params['criterio']}%') ";
            }
            $conn = Zend_Registry::get('conexion');
            $result = $conn->fetchAll($objSql['select'].$objSql['from'].$objSql['where'].$objSql['limit']);
            return array('datos' => $result, 'cantidad' => count($result));

        }

        public function getPaciente($params)
        {
		$sql = "SELECT vc.idventacliente, vc.nombre FROM mod_logpuntoventa.dat_ventacliente vc
        		WHERE vc.numeroidentidad LIKE '{$params['cipaciente']}'";
		$conn = Zend_Registry::get('conexion');
		$result = $conn->fetchAll($sql);
		if (count($result))
            	{
               		$sql = "SELECT tm.idtarjetamedicamento FROM mod_logfarmacia.dat_tarjetamedicamento tm
                        	WHERE tm.idpaciente = {$result[0]['idventacliente']} ";
	                $conn = Zend_Registry::get('conexion');
        	        $aux = $conn->fetchAll($sql);
                	$result[0] = array('yatiene'=>count($aux), 'nombre'=> $result[0]['nombre']);
            }

            return $result;
        }

        public function renovarProductoTarjeta($params)
        {
            if ($params)
            {
                $sql = "insert into mod_logfarmacia.his_productotarjetamedicamento
                (idcuadrobasico,idtarjetamedicamento,dosis,fechaemision,fechaexpiracion,origenprescripcion,nroregistro,especialidad,causa,idproductotarjetamedicamento)
                select idcuadrobasico,idtarjetamedicamento,dosis,fechaemision,fechaexpiracion,origenprescripcion,nroregistro,especialidad,'0' as causa,idproductotarjetamedicamento
                from mod_logfarmacia.dat_productotarjetamedicamento
                where idproductotarjetamedicamento={$params['ids'][0]}";
                $conn = Zend_Registry::get('conexion');
                $conn->execute($sql);

                $this->desaprobar($params);
            }
        }

        public function cambioTratamiento($params)
        {
            if ($params)
            {
                $sql = "insert into mod_logfarmacia.his_productotarjetamedicamento
                (idcuadrobasico,idtarjetamedicamento,dosis,fechaemision,fechaexpiracion,origenprescripcion,nroregistro,especialidad,causa,idproductotarjetamedicamento)
                select idcuadrobasico,idtarjetamedicamento,dosis,fechaemision,fechaexpiracion,origenprescripcion,nroregistro,especialidad,'1' as causa,idproductotarjetamedicamento
                from mod_logfarmacia.dat_productotarjetamedicamento
                where idproductotarjetamedicamento={$params['ids'][0]}";
                $conn = Zend_Registry::get('conexion');
                $conn->execute($sql);
                Doctrine_Query::create()->delete("DatProductoTarjeta dpt")->whereIn("idproductotarjetamedicamento ", $params['ids'])->execute();
            }
        }

        public function desaprobar($params)
        {
            $update = " UPDATE
            mod_logfarmacia.dat_productotarjetamedicamento SET aprobado = 0
            WHERE idproductotarjetamedicamento = {$params['ids'][0]}";
            $conn = Zend_Registry::get('conexion');
            $conn->execute($update);

        }

        public function expirar($params)
        {
            $update = " UPDATE
            mod_logfarmacia.dat_productotarjetamedicamento SET aprobado = 2
            WHERE idproductotarjetamedicamento = {$params['ids']}";
            $conn = Zend_Registry::get('conexion');
            $conn->execute($update);

        }
	//Importar
        public function importarFichero($file, $params)
        {
            $error = $file['error'];
            Doctrine_Query::create()->delete('DatImptarjeta')->execute();
            $collection = new Doctrine_Collection('DatImptarjeta');
            $collection->synchronizeWithArray($file['productos']);
            $collection->save();

            $idestructuracomun = $this->global->Estructura->idestructura;
            $idejercicio = $this->configuracionHelper->getEjercicioActualSubsistema($this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FARMACIA);
            $idperiodo = $this->configuracionHelper->getPeriodoActualSubsistema($this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FARMACIA);
            $objTarjeta = $this->documentosHelper->devuelveIddocByIdEstructura(
                'tarjetaMedLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FARMACIA
            );
            $iddoc = $objTarjeta->iddoc;
            $idusuario = $this->global->Perfil->idusuario;
            $operacion = $this->configuracionHelper->obtenerOperaciones(null, null, $iddoc);
            $idoperacion = $operacion[0]['idnomoperaciones'];
            $idcronologia = $this->cronologia();
            $fecha = $this->configuracionHelper->getFechaContableSubsistemaObj($this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FARMACIA);
            $fechacontable = $fecha->fecha;
            $annoFecha = explode('/', $fecha->fecha);
            $anno = ($annoFecha[2]) ? $annoFecha[2] : date('Y');
            $numeroref = $this->devolverUltimoNumeroDoc($iddoc, $idestructuracomun, $idejercicio);
            if (!$error) {
                $sql = "SELECT * FROM mod_logfarmacia.f_importatarjeta(
                        {$idestructuracomun},
                        {$iddoc},
                        {$idoperacion},
                        {$idejercicio},
                        {$idperiodo},
                        {$idcronologia},
                        {$idusuario},
                        '{$fechacontable}'::date,
                        {$anno},
                        {$numeroref}
                )";
                $result = Doctrine_Manager::connection()->fetchOne($sql);
            }

            $arreglo = explode(",",$result);
            $importados = $arreglo[1];
            $actualizados = $arreglo[2];
            $arreglo1 = $arreglo[3];
            $descartados = explode("}",$arreglo1);

            if (substr_count($result, ',') > 0) {
                $error = 4;
            }
            return array(
                'total' => $collection->count(), 'datos' => $collection->toArray(),
                'error' => $error,
                'detalles' => $result,
                'importados'=>$importados,
                'descartados'=>$descartados[0],
                'actualizados'=>$actualizados
            );
        }

        public function buscarCuadroBasico($params,$idestructuracomun)
        {
            $sql = " SELECT distinct ccb.idcuadrobasico ";
            $from = " FROM mod_logfarmacia.conf_cuadrobasico ccb
            INNER JOIN mod_datosmaestros.nom_indicador ni on ni.idindicador= ccb.idindicador ";
            $where = " WHERE ni.denominacion like (Select di.medicamento from mod_logfarmacia.dat_imptarjeta di
            group by ccb.idcuadrobasico, di.medicamento limit 1)";
            $conn = Zend_Registry::get('conexion');
            $idcuadrobasico = $conn->fetchAll($sql.$from.$where);
            return $idcuadrobasico[0]['idcuadrobasico'];
        }

	public function sincronizarArray($datos, $params)
	{
		$campos = array('nofarmacia','numeroidentidad','nombrepaciente', 'snombrepaciente', 'apellidopaciente', 'sapellidopaciente',
				'direccion','cmf', 'provincia', 'municipio', 'medicamento', 'dosis',
				'nombremedico', 'snombremedico', 'apellidomedico', 'sapellidomedico', 'nroregistro', 'cmfarchivado',
				'policlinico', 'hospital', 'otrasunidades', 'fechaexpedicion');
		$productos = array();
		foreach ($datos as $index => $item) {
			if ($index > 0) {
				$prod = array();
				foreach ($item as $key => &$value) {
					$value = trim($value);
					if ($value && (substr_count($campos[$key], 'cantidad') || substr_count($campos[$key], 'precio') ||
						substr_count($campos[$key], 'importe'))) {
						$value = str_replace(',', '', $value);
                			}
                    $value = (mb_detect_encoding($value, 'UTF-8', true)) ? $value : utf8_encode($value);
                    $value = str_replace('\'', '\'||chr(39)||\'', $value);
					$prod[$campos[$key]] = $value ? $value : null;
				}
				$productos[] = $prod;
			}
		}
		return array('productos' => $productos, 'error' => $error);
	}

	public function cargarProductoError($filtro)
	{
		$selectD ="select motivodescarte, nofarmacia, numeroidentidad, nombrepaciente, snombrepaciente, apellidopaciente,
			sapellidopaciente, direccion, cmfarchivado, provincia, municipio,
			medicamento, dosis, nombremedico, snombremedico, apellidomedico, sapellidomedico,
			nroregistro, cmf, policlinico, hospital, otrasunidades, fechaexpedicion
			from mod_logfarmacia.log_detallesestadisticaimptarjeta
			where idestadistica in (select max(idestadistica) from mod_logfarmacia.log_estadisticaimptarjeta
						where idestructura = {$this->global->Estructura->idestructura})
			group by motivodescarte, nofarmacia, numeroidentidad, nombrepaciente, snombrepaciente, apellidopaciente,
				sapellidopaciente, direccion, cmfarchivado, provincia, municipio,
				 medicamento, dosis, nombremedico, snombremedico, apellidomedico, sapellidomedico,
				 nroregistro, cmf, policlinico, hospital, otrasunidades, fechaexpedicion
			order by motivodescarte";
		$cantidad = count(Doctrine_Manager::connection()->fetchAll($selectD));
		$datosarray = array('cantidad' => $cantidad, 'datos' => Doctrine_Manager::connection()->fetchAll($selectD . " OFFSET {$filtro['start']} LIMIT {$filtro['limit']}"));

		return $datosarray;
	}

	public function eliminarImportar()
	{
		Doctrine_Query::create()->delete('DatImptarjeta')->execute();
	}

	public function crearExcelFarmacia($parametros)
	{
		mkdir('tmp');
		$fecha = date("y.m.d");
		$fichero = "tmp/listado_tarjetones_{$fecha}.xls";
		$excel = new ExcelWriter($fichero);
		$data = $this->cargarProductoError(['start' => 0,'limit' => 1]);
		$cantidadTotal = $data['cantidad'];
		$aumento = 10000;
		$columns = array(
				array('header' => '<b>No.Farmacia</b>', 'dataIndex' => 'nofarmacia'),
			        array('header' => '<b>CarnétdeIdentidad</b>', 'dataIndex' => 'numeroidentidad'),
			        array('header' => '<b>1erNombrePaciente</b>', 'dataIndex' => 'nombrepaciente'),
			        array('header' => '<b>2doNombrePaciente</b>', 'dataIndex' => 'snombrepaciente'),
			        array('header' => '<b>1erApellidoPaciente</b>', 'dataIndex' => 'apellidopaciente'),
			        array('header' => '<b>2doApellidoPaciente</b>', 'dataIndex' => 'sapellidopaciente'),
			        array('header' => '<b>DirecciónParticular</b>', 'dataIndex' => 'direccion'),
			        array('header' => '<b>CMF(archivado)</b>', 'dataIndex' => 'cmfarchivado'),
			        array('header' => '<b>Provincia</b>', 'dataIndex' => 'provincia'),
			        array('header' => '<b>Municipio</b>', 'dataIndex' => 'municipio'),
			        array('header' => '<b>Medicamento</b>', 'dataIndex' => 'medicamento'),
			        array('header' => '<b>DosisMensual</b>', 'dataIndex' => 'dosis'),
			        array('header' => '<b>1erNombreMedico</b>', 'dataIndex' => 'nombremedico'),
			        array('header' => '<b>2doNombreMedico</b>', 'dataIndex' => 'snombremedico'),
			        array('header' => '<b>1erApellidoMedico</b>', 'dataIndex' => 'apellidomedico'),
			        array('header' => '<b>2doApellidoMedico</b>', 'dataIndex' => 'sapellidomedico'),
			        array('header' => '<b>RegistroProfesional</b>', 'dataIndex' => 'nroregistro'),
			        array('header' => '<b>CMF</b>', 'dataIndex' => 'cmf'),
			        array('header' => '<b>Policlinico</b>', 'dataIndex' => 'policlinico'),
			        array('header' => '<b>Hospitaly/oInstituto</b>', 'dataIndex' => 'hospital'),
			        array('header' => '<b>OtrasUnidades</b>', 'dataIndex' => 'otrasUnidades'),
			        array('header' => '<b>FechadeExpedición</b>', 'dataIndex' => 'fechaexpedicion')
				);

		foreach ($columns as $col) {
			$excel->writeCol($col['header']);
		}
		$excel->writeRow();
		for ($i=0; $i < $cantidadTotal; $i = $i + $aumento) {
			$datos = $this->cargarProductoError(['start' => $i, 'limit' => $aumento])['datos'];
			$this->crearExcel($columns,$datos, $excel);
		}
		$excel->close();

		return '/logistica/farmacia/farmacia/' . $fichero;
	}

	public function crearExcel($columns, $datos, &$excel)
	{
		foreach ($datos as $dato) {
			foreach ($columns as $col) {
				$index = $col['dataIndex'];
				if($dato[$index]){
					$excel->writeCol($dato[$index]);
				} else {
					$excel->writeCol('');
					}
			}
			$excel->writeRow();
		}
	}
}
<?php

/**
 * @class GestcierreinventarioModel
 * Clase que se encarga de las acciones
 * para realizar la carga de los documentos pendientes de los subsistemas y
 * la realización del cierre
 * @namespace Logistica\Inventario\ComunInv\Models\
 * @author Divisiçon de Gestiçon de Entidades
 * @copyright XETID
 * @version 1.0
 */
class GestcierreinventarioModel extends GestcierreModel
{

    public function gestcierreinventarioModel()
    {
        parent::gestcierreModel();
    }

    /**
     * @method cargarDocuPendInv
     * Acción para cargar los documentos pendientes que se
     * encuentran en el subsistema de Inventario
     * @params $parametros Parametros provenientes de la vista
     * @return Arreglo con los documentos pendientes
     */
    public function cargarDocuPendInv($parametros, $apertura = false)
    {
        return parent::cargarDocuPendInv($parametros, $apertura);
    }

    /**
     * @method cierreDiario
     * Acción para realizar el cierre diario de los documentos
     * pendientes de los subsistemas
     * @params $subsistema Id del subsistema sobre el cual se realizará
     * el cierre diario
     * @return null
     */
    public function cierreDiario()
    {
        return parent::cierreDiario(LogisticaGlobal::SUBSISTEMA_INV);
    }

    /**
     * @method cierrePeriodo
     * Acción para realizar el cierre período de los documentos
     * pendientes de los subsistemas
     * @params $subsistema Id del subsistema sobre el cual se realizará
     * el cierre período
     * @return null
     */
    public function cierrePeriodo()
    {
        $this->validarCierre();
        $cerrarDif = "select count(nv.valor) from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'CERRAR_CONDIF' and valor = 'true'";
        $validarDif = LogisticaDoctrineHelper::__init()->getConnection()->execute($cerrarDif)->fetchAll(PDO::FETCH_COLUMN);
        if (count($validarDif) && $validarDif[0] == 0) {
            $diferencias = $this->validarDiferenciasContabilidad();
            if ($diferencias['diferencias']) {
                return array('success' => false, 'codMsg' => 4,
                    'codigoMsg' => 4,
                    'mensaje' => 'Existen diferencias entre inventario y contabilidad',
                    'detalles'=> $diferencias['detalle']);
            }
        }
        parent::cierrePeriodo(LogisticaGlobal::SUBSISTEMA_INV);
        LogisticaFechasHelper::__init()->cierrePeriodo();
    }

    /**
     * @method cierreEjercicio
     * Acción para realizar el cierre ejercicio de los documentos
     * pendientes de los subsistemas
     * @params $subsistema Id del subsistema sobre el cual se realizará
     * el cierre ejercicio
     * @return null
     */
    public function cierreEjercico()
    {
        $this->validarCierre();
        return parent::cierreEjercico(LogisticaGlobal::SUBSISTEMA_INV);
    }


    public function cargaDatosFecha()
    {
        return parent::cargaDatosFecha(LogisticaGlobal::SUBSISTEMA_INV);
    }


    /**
     * Metodo para realizar el cierre de la apertura de todos los depositos
     *
     * @return array
     */
    public function cierreApertura()
    {
        $objApert = new AperturaService();
        $idestructura = $this->global->Estructura->idestructura;
        $datos = $objApert->devolverDocumentos(array('estado' => 1));
        if ($datos['cantidad'] > 0) {
            return array('error' => 1);//Si existen documentos de apertura en elaboracion enviar error 1
        } else {//Todos los documentos tienen que estar en preparado
            $cuentasInventario = $this->obtenerSaldosCuentasInventario($idestructura);
            $cuentasInventarioAlt = $this->obtenerSaldosCuentasInventario($idestructura, 0);
            $cuentasContabilidad = $this->contabilidadHelper->obtenerSaldoDiarioContableCuenta(
                $idestructura, $this->configuracionHelper->getFechaContableSubsistema(
                    $idestructura, LogisticaGlobal::SUBSISTEMA_INV
                ),$this->objectHelper->extractValueFromArrayColumn($cuentasInventario,'idcuenta'),'idcuenta'
            );
            $cuentasContabilidadAlt = $this->contabilidadHelper->obtenerSaldoDiarioContableCuenta(
                $idestructura, $this->configuracionHelper->getFechaContableSubsistema(
                    $idestructura, LogisticaGlobal::SUBSISTEMA_INV
                ),$this->objectHelper->extractValueFromArrayColumn($cuentasInventarioAlt,'idcuenta'),'idcuenta'
            );
			
			//print_r(array($cuentasInventario, $cuentasContabilidad,$cuentasInventarioAlt, $cuentasContabilidadAlt));die;

            if (/*count($cuentasInventario) == count($cuentasContabilidad) &&
                count($cuentasInventarioAlt) == count($cuentasContabilidadAlt)*/true) {//Comparar si las cuentas tienen el mismo saldo.
                //el resultado de contabilidad tiene que organizarse por idcuenta
                /*foreach ($cuentasContabilidad as $index => $value) {
                    if ($cuentasInventario[$index]['saldo'] != $value['saldo']) {
                        return array('error' => 2); //Error que no coenciden los saldos de las cuentas
                    }
                }
				
                foreach ($cuentasContabilidadAlt as $index => $value) {
                    if ($cuentasInventarioAlt[$index]['saldo'] != $value['saldo']) {
                        return array('error' => 2); //Error que no coenciden los saldos de las cuentas
                    }
                }*/

                $datosApert = $objApert->devolverDocumentos(array('estado' => 2));//Aprobar todos los documentos de apertura

                foreach ($datosApert['datos'] as $datAper) {
                    if (!$objApert->aprobarDocumentos($datAper['iddocumento'])) {
                        return array('error' => 3);//Ocurrio un error al aprobar las apertura
                    }
                    $objApert->abrirDeposito($datAper['iddocumento']);
                }
                $this->configuracionHelper->cierreCargaInicial($idestructura,LogisticaGlobal::SUBSISTEMA_INV);
                return array('exito' => 1);
            } else {
                return array('error' => 2);
            }
        }
    }

    public function validarCierre(){
        $estructurasubsist = $this->integrator->datosmaestros->buscarInstancia($this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV);
        if ($estructurasubsist->contabiliza) {
            $datos = $this->cargarDocuPendInv(array());
            if($datos['cantidad'] > 0){
                throw new ZendExt_Exception('LOG_LB_CIERE_002');
            }
        }
    }

    private function validarDiferenciasContabilidad() {
        $balanceModel = new BalancecontableModel();
        $fechaInv = $this->configuracionHelper->getFechaContableSubsistema(
            $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV
        );
        $datos = $balanceModel->getDatosPrincipales($fechaInv);
        $diferencias = "<table style='width:90%'><tr><th><b>Cuenta</b></th>
                            <th style='width:100px; text-align:right;'><b>Saldo contable</b></th>
                            <th style='width:100px; text-align:right;'><b>Saldo inventario</b></th>
                            <th style='width:100px; text-align:right;'><b>Diferencia</b></th>
                        </tr>";
        $existe = false;
        $ctasDifSql = "select nv.valor from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'CTAS_CERRAR_DIF'";
        $ctasDif = LogisticaDoctrineHelper::__init()->getConnection()->execute($ctasDifSql)->fetchAll(PDO::FETCH_ASSOC);
        if (count($ctasDif)) {
            $ctas = str_replace(',', '\',\'', $ctasDif[0]['valor']);
            $sqlIds = "SELECT ncue.idcuenta from mod_contabilidad.nom_cuenta ncue
                       inner join (SELECT parent_path FROM mod_contabilidad.nom_cuenta cuta 
			           where cuta.concatcta in ({$ctas})) c on (ncue.parent_path OPERATOR(public.<@) c.parent_path)";
            $idsDif = LogisticaDoctrineHelper::__init()->getConnection()->execute($sqlIds)->fetchAll(PDO::FETCH_COLUMN);
        }
        foreach ($datos as $d) {
            if (abs($d['diff']) > 0 && !in_array($d['idcuenta'], $idsDif)) {
                $existe = true;
                $diferencias .= '<tr><td>'. $d['concatctax']. "</td>".
                    "<td style='text-align:right'>". number_format($d['saldo'], 2, '.', ',').'</td>'.
                    "<td style='text-align:right'>". number_format($d['valorinv'], 2, '.', ',').'</td>'.
                    "<td style='text-align:right'>". number_format($d['diff'], 2, '.', ',').'</td><tr>';
            }
        }
        $diferencias .= '</table>';
        return array('diferencias' => $existe, 'detalle'=>$diferencias);
    }

    private function obtenerSaldosCuentasInventario($idestructura, $campo = 1)
    {
        //Consulta que obtiene los importe totales  agrupados por cuenta de inventario
        $objDocPrim = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
            'aperturaLog', $idestructura, LogisticaGlobal::SUBSISTEMA_INV
        );
        $cuenta = $campo == 1 ? 'idcuenta' : 'idcuentaalt';
        $campo = $campo == 1 ? 'importecontable' : 'importealternativo';
        $select = "SELECT cc.{$cuenta} AS idcuenta, round(sum(m.{$campo}),2) as saldo
              From mod_logistica.dat_documento d
              inner join mod_logistica.dat_movimiento m on m.iddocumento = d.iddocumento
              inner join mod_logistica.dat_producto p on p.idproducto = m.idproducto
              inner join mod_logistica.nom_clasificacioncontable cc on 
              p.idclasificacioncontable = cc.idclasificacioncontable
              where d.iddoc = {$objDocPrim->iddoc} AND cc.{$cuenta} IS NOT NULL
			  AND p.idestructuracomun = {$this->global->Estructura->idestructura}
              GROUP by cc.{$cuenta} having round(sum(m.{$campo}),2) > 0
              Order by cc.{$cuenta} ";
        $conn = Zend_Registry::get('conexion');
        return $conn->fetchAll($select);
    }
	
	public function getBalanceApertua(){
        $objDocPrim = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
            'aperturaLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV
        );
        $sql = "select c.concatcta as cuenta,coalesce(sum(ces.debito)-sum(ces.credito),0.0) as saldo,
                    (
                     SELECT round(sum(m.importecontable),2) 
                                From mod_logistica.dat_documento d
                                inner join mod_logistica.dat_movimiento m on m.iddocumento = d.iddocumento
                                inner join mod_logistica.dat_producto p on p.idproducto = m.idproducto
                                inner join mod_logistica.nom_clasificacioncontable cc on                                 
                                p.idclasificacioncontable = cc.idclasificacioncontable
                                where d.iddoc = {$objDocPrim->iddoc} and p.idestructuracomun = {$this->global->Estructura->idestructura} AND cc.idcuenta = c.idcuenta
                    ) as saldoinvcup,
                    (
                     SELECT round(sum(m.importealternativo),2) 
                                From mod_logistica.dat_documento d
                                inner join mod_logistica.dat_movimiento m on m.iddocumento = d.iddocumento
                                inner join mod_logistica.dat_producto p on p.idproducto = m.idproducto
                                inner join mod_logistica.nom_clasificacioncontable cc on 
                                p.idclasificacioncontable = cc.idclasificacioncontable
                                where d.iddoc = {$objDocPrim->iddoc} and p.idestructuracomun = {$this->global->Estructura->idestructura} AND cc.idcuentaalt = c.idcuenta
                    ) as saldoinvcuc
                  from mod_contabilidad.nom_cuenta c 
                  inner join mod_contabilidad.res_resumen_pase ces on ces.idcuenta = c.idcuenta 
                            and ces.idestructuracomun = {$this->global->Estructura->idestructura}
                  inner join mod_logistica.nom_clasificacioncontable ncc on (ncc.idcuenta = c.idcuenta or ncc.idcuentaalt = c.idcuenta)
                  group by  c.idcuenta, c.concatcta order by c.concatcta";
				  die($sql);
        return $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

}

<?php

/**
 * @class      ConfiguracioninventarioModel
 * @package    Inventario
 * @subpackage Configuracion
 * @author     Antonio Diaz Soutuyo
 * @copyright  XETID
 * @version    2.0
 */
class ConfiguracioninventarioModel extends ZendExt_Model
{

  private $configuracioGeneral;

  public function __construct()
  {
    parent::ZendExt_Model();
    $this->configuracionGeneral = ServiciosConfiguracionGeneralHelper::__init();
  }

  /**
   * @method salvarconfiguracion
   * @author Antonio Diaz Soutuyo
   * @return Retorna true si se salvo la configuracion de inventario
   * correctamente

   */
  public function salvarConfiguracion($datos = array())
  {
    $cfgInventario = new ConfInventario();
    $datos['otrosmas'] = $datos['otrosmas'] ? 1 : 0;
    $datos['usarcategoria'] = $datos['usarcategoria'] ? 1 : 0;
    $datos['usarubicacion'] = $datos['usarubicacion'] ? 1 : 0;
    $datos['usarlote'] = $datos['usarlote'] ? 1 : 0;
    $datos['firmadigital'] = $datos['firmadigital'] ? 1 : 0;
    $datos['contintegrada'] = $datos['contintegrada'] ? 1 : 0;
    $datos['comprobante'] = $datos['comprobante'] ? 1 : 0;
    $datos['importemas'] = $datos['importemas'] ? 1 : 0;
    $datos['merma'] = $datos['merma'] ? 1 : 0;
    $datos['rotura'] = $datos['rotura'] ? 1 : 0;
    $datos['otrosmenos'] = $datos['otrosmenos'] ? 1 : 0;
    $datos['importemenos'] = $datos['importemenos'] ? 1 : 0;
    $datos['registrarcantidad'] = $datos['registrarcantidad'] ? 1 : 0;
    $datos['almacen'] = $datos['almacen'] ? 1 : 0;
    $datos['idtipotasa'] = $datos['idtipotasa'] ? $datos['idtipotasa'] : null;
    $datos['idpadre'] = $datos['idpadre'] ? $datos['idpadre'] : null;
    $datos['coddenominacion'] = $datos['coddenominacion'] ? $datos['coddenominacion'] : null;
    $datos['tarjeta'] = $datos['tarjeta'] ? 1 : 0;
    $datos['descuentorecargo'] = $datos['descuentorecargo'] ? 1 : 0;
    $datos['ordenproducto'] = $datos['ordenproducto'] ? $datos['ordenproducto'] : 1;
    // $datos['idnomsubordinacion'] = $datos['idnomsubordinacion'] ? $datos['idnomsubordinacion'] : 0;
    if ($cfgInventario->existeConfiguracion($datos['idestructuracomun'])) {
      $cfgInventario->assignIdentifier($datos['idestructuracomun']);
    }
    // para cargar todas las estructuras con la misma subordinacion
    if ($datos['usarentidades'] == 1) {
      $this->subordinacionTotal($datos['idnomsubordinacion']);
    }
    $cfgInventario->synchronizeWithArray($datos);
    $cfgInventario->save();
    $datos['minimo'] = $datos['minimo'] ? $datos['minimo'] : 0;
    $datos['fondofijo'] = $datos['fondofijo'] ? $datos['fondofijo'] : 0;
    $datos['reserva'] = $datos['reserva'] ? $datos['reserva'] : 0;
    $datos['normabast'] = $datos['normabast'] ? $datos['normabast'] : 0;
    $datos['minarea'] = $datos['minarea'] ? $datos['minarea'] : 0;
    $datos['ptoreposicion'] = $datos['ptoreposicion'] ? 1 : 0;
    $datos['diaconsignado'] = $datos['diaconsignado'] ? $datos['diaconsignado'] : 0;
    $datos['diaminvencido'] = $datos['diaminvencido'] ? $datos['diaminvencido'] : 0;
    $datos['diamintarjeta'] = $datos['diamintarjeta'] ? $datos['diamintarjeta'] : 0;
    $datos['diaproxvencer'] = $datos['diaproxvencer'] ? $datos['diaproxvencer'] : 0;
    $datos['lotevencido'] = $datos['lotevencido'] ? 1 : 0;
    $cfgInventarioExt = new ConfInventarioExt();
    if ($cfgInventarioExt->existeConfiguracion($datos['idestructuracomun'])) {
      $cfgInventarioExt->assignIdentifier($datos['idestructuracomun']);
    }
    $cfgInventarioExt->synchronizeWithArray($datos);
    $cfgInventarioExt->save();
    $datos['ordenproducto'] = $datos['ordenproducto'] ? $datos['ordenproducto'] : 1;
    $datos['cuadrediario'] = $datos['cuadrediario'] ? 1 : 0;
    Doctrine_Query::create()->update('ConfInventario')
    ->set('cuadrediario', $datos['cuadrediario'])
    ->set('ordenproducto', $datos['ordenproducto'])
    ->execute();

    return true;
  }

  /**Pone todas las estructuras o entidades
   * en la subordinacion de la padre
   **/
  public function subordinacionTotal($params)
  {
    return Doctrine_Query::create()
      ->update('idnomsubordinacion')
      ->from('ConfInventario')
      ->set('idnomsubordinacion', $params)
      ->fetchArray();
  }

  /**
   * @method existeConfiguracion
   * @author Antonio Diaz Soutuyo
   * @return Retorna true si la configuracion si existe
   */
  public function existeConfiguracion($idestructuracomun)
  {
    $idestructuracomun =
    (is_null($idestructuracomun) || $idestructuracomun == 0) ? $this->global->Estructura->idestructura
    : $idestructuracomun;
    return ConfInventario::existeConfiguracion($idestructuracomun);
  }

  /**
   * @method devolverConfiguracion
   * @author Antonio Diaz Soutuyo
   * @return Retorna la configuracion si existe
   */
  public function devolverConfiguracion($identidad = null)
  {
    $identidad = (is_null($identidad) || $identidad == 0) ? $this->global->Estructura->idestructura : $identidad;
    $result = ConfInventario::devolverConfiguracion($identidad);
    $result['cantidadmoneda'] = $this->cargarMonedas();
    return $result;
  }

  /**
   * @method cargarOperacionesAjuste
   * @author Antonio Diaz Soutuyo
   * @return Retorna los tipo operaciones de operaciones que se realizan
   * en un ajuste
   **/
  public function cargarOperacionesAjuste($operaciones)
  {
    $idestructura = $this->global->Estructura->idestructura;
    $datos = $this->configuracionGeneral->getTipoOperacionesDoc(
      'ajusteLog', $idestructura, LogisticaGlobal::SUBSISTEMA_INV
    );
    $data = array();
    foreach ($datos as $dat) {
      if ($operaciones == $dat->signo) {
        $obj = new stdClass();
        $obj->idoperacion = $dat->idoperacion;
        $obj->denominacion = $dat->denominacion;
        $obj->idnomoperaciones = $dat->idnomoperaciones;
        $obj->idconcepto = $dat->idconcepto;
        $obj->concepto = $dat->concepto;
        $obj->signo = $dat->signo;
        $data[] = $obj;
      }
    }
    return $data;
  }

  public function cargarTiposTasa()
  {
    return $this->configuracionGeneral->getTipoTasas();
  }

  /**
   * @method cargarMonedas()
   * @author Gabriel Ibarra Garcia
   * @return Retorna la cantidad de Monedas de la entidad
   **/
  public function cargarMonedas()
  {
    $monedas = $this->configuracionGeneral->monedaContableEntidad($this->global->Estructura->idestructura);
    return count($monedas['datos']);
  }
  /**
   * @method obtenerEstructurasUMayor()
   * @author Gabriel Ibarra Garcia
   * @return Retorna las estructuras de las unidades de militares
   **/
  public function obtenerEstructurasUMayor($params)
  {
    //$query = Doctrine_Query::create()->select('CONCAT(codigo,'."' '".', denominacion) as coddenominacion,codigo,idestructura,denominacion')->from('DatEstructura');
    $query = "SELECT codigo||' '||denominacion as coddenominacion,codigo,idestructura,denominacion
                  FROM mod_estructuracomp.dat_estructura ";
    if ($params['organo']) {
      $query .= "where idconcepto=1";
      //$query->addWhere('idconcepto=1');
    } else if ($params['entidad']) {
      //entidad
      $query .= "where idconcepto=3";
      //$query->addWhere('idconcepto=3');
    } else if ($params['criterioB']) {
      /*$query->addWhere(
      "(codigo ILIKE '{$params['criterioB']}%' "
      . " OR denominacion ILIKE '%{$params['criterioB']}%')"
      );*/
      $query .= "where (codigo ILIKE '{$params['criterioB']}%' "
        . " OR denominacion ILIKE '%{$params['criterioB']}%')";
    } else {
      //$query->addWhere('idconcepto=3 or idconcepto=1');
      $query .= "where idconcepto=3 or idconcepto=1";
    }
    $data = $this->doctrineHelper->getConnection()->fetchAssoc($query);
    return array(
      'cantidad' => count($data),
      'datos' => $data)
    ;
  }

}

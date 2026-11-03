<?php

/**
 * Daniel Arias Espinosa
 * 07/12/15
 */
class ConfSistemaMedioActividadModel extends ZendExt_Model
{

    protected $_serviciosPlanificacion, $_serviciosEstructuraComposicion, $_logisticaDoctrine;

    public function __construct()
    {
        parent::__construct();
        $this->_serviciosPlanificacion = ServiciosPlanificacionHelper::__init();
        $this->_serviciosEstructuraComposicion = ServiciosEstructuraComposicionHelper::__init();
        $this->_logisticaDoctrine = LogisticaDoctrineHelper::__init();

    }

    public function adicionarActividadesPorSistema($parametros = array())
    {
        $activAdicionadas = Zend_Json::decode($parametros['actividades']);
        $actividadesAddArray = new Doctrine_Collection('CfgActividadSistemaMedio');
        foreach ($activAdicionadas as $actv) {
            //into $actv debe estar idnomsistemamedio y idactividad
            $activ['idactividad'] = $actv;
            $activ['idnomsistemamedio'] = $parametros['idnomsistemamedio'];
            $objActividad = new CfgActividadSistemaMedio();
            if (is_array($activ)) {
                $objActividad->synchronizeWithArray($activ);
            }
            $actividadesAddArray[] = $objActividad;

        }
        if ($actividadesAddArray->count()) {
            $actividadesAddArray->save();
        }
    }

    public function eliminarActividad($parametros)
    {
        $parametros['idnomsistemamedio'] = Zend_Json::decode($parametros['idnomsistemamedio']);
        $parametros['idactividad'] = Zend_Json::decode($parametros['idactividad']);
        return Doctrine_Query::create()->delete('CfgActividadSistemaMedio')
            ->whereIn('idactividad ', $parametros['idactividad'])
            ->andWhere('idnomsistemamedio = ?', array($parametros['idnomsistemamedio']))
            ->execute();
    }

    public function cargarActividades($parametros = array())
        /*  {

              if ($parametros['criterio']) {
                  $filtro[] = array('valor' => $parametros['criterio']);
              }
              if ($parametros['idnomsistemamedio']) {
                  $parametros['idnomsistemamedio'] = Zend_Json::decode($parametros['idnomsistemamedio']);
                  $query = Doctrine_Query::create();
                  $query->select('actv.idconfactividadsistemamedio, actv.idactividad ')
                      ->from('CfgActividadSistemaMedio actv')
                      ->where('actv.idnomsistemamedio = ?', array($parametros['idnomsistemamedio']));
                  $actAdded = $query->fetchArray();

                  if($actAdded) {
                      foreach ($actAdded as $arr) {
                          $idsExcluir[] = $arr['idactividad'];
                      }
                      $idsExcluir =implode(',', $idsExcluir);
                      $filtro[] = array('notIn' => $idsExcluir);
                  }
              }
              $result = $this->_serviciosPlanificacion->obtenerActividadyNorma(
                  ($parametros['nivel']) ? $parametros['nivel'] : 4,
                  ($parametros['idservicio']) ? $parametros['idservicio'] : null, $filtro,
                  ($parametros['start']) ? $parametros['start'] : 0, ($parametros['limit']) ? $parametros['limit'] : 30,
                  ($parametros['hijos']) ? $parametros['hijos'] : 0
              );

              return $result;
          }*/
    {

        $selec = "Select ca.denominacion, ca.idactividad, ni.codigo as codigo, dae.identidad, um.abreviaturaunidadmedida as umedida, count (*) over() as total ";

        $from = " FROM  mod_logtaller.conf_actividad ca left join mod_logtaller.dat_actividadentidad dae on ca.idactividad = dae.idactividad and dae.identidad = {$this->global->Estructura->idestructura}" .
            " left join mod_datosmaestros.nom_indicador ni on ni.idindicador = ca.idindicador " .
            " left join mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = ni.idumedida ";
        $where = " where ca.idpadre is not null";

        if ($parametros['criterio']) {
            $where .= " AND ca.denominacion LIKE '%{$parametros['criterio']}%'"
                . " OR ni.codigo LIKE '%{$parametros['criterio']}%'"
                . "OR um.abreviaturaunidadmedida LIKE '%{$parametros['criterio']}%' ";

        }
        $datos = LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($selec . $from . $where);
        return array('datos' => $datos, 'cantidad' => $datos[0]['total']);
    }




    public function cargarActividadesPorSistema($parametros = array())
    {
        if ($parametros['idnomsistemamedio']) {
            $parametros['idnomsistemamedio'] = Zend_Json::decode($parametros['idnomsistemamedio']);

            $select = "select actv.idconfactividadsistemamedio, actv.idactividad,ca.denominacion, ni.codigo as codigo, dae.identidad, um.abreviaturaunidadmedida as umedida, count (*) over() as total  ";
            $from = " FROM mod_logactivofijotangible.conf_actividadsistemamedio actv 
        left join mod_logtaller.conf_actividad ca on actv.idactividad = ca.idactividad " .
                " left join mod_logtaller.dat_actividadentidad dae on ca.idactividad = dae.idactividad and dae.identidad = {$this->global->Estructura->idestructura}" .
                " left join mod_datosmaestros.nom_indicador ni on ni.idindicador = ca.idindicador " .
                " left join mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = ni.idumedida ";
            $where = " where actv.idnomsistemamedio = {$parametros['idnomsistemamedio']} ";
            $datos = LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($select . $from . $where);
            return array('datos' => $datos, 'cantidad' => $datos[0]['total']);

        }
    }

    public function adicionarMedioPorSistema($parametros = array())
    {
        $mediosAdicionados = Zend_Json::decode($parametros['medios']);
        $mediosAddArray = new Doctrine_Collection('CfgMedioSistemaMedio');
        foreach ($mediosAdicionados as $med) {
            $medio['idindicador'] = $med;
            $medio['idnomsistemamedio'] = $parametros['idnomsistemamedio'];
            $objMedio = new CfgMedioSistemaMedio();

            if (is_array($medio)) {
                $objMedio->synchronizeWithArray($medio);
            }
            $mediosAddArray[] = $objMedio;
        }

        if ($mediosAddArray->count()) {
            $mediosAddArray->save();
        }
    }

    public function eliminarMedios($parametros)
    {
        $parametros['idnomsistemamedio'] = Zend_Json::decode($parametros['idnomsistemamedio']);
        $parametros['idindicador'] = Zend_Json::decode($parametros['idindicador']);
        return Doctrine_Query::create()->delete('CfgMedioSistemaMedio')
            ->whereIn('idindicador ', $parametros['idindicador'])
            ->andWhere('idnomsistemamedio = ?', array($parametros['idnomsistemamedio']))
            ->execute();
    }

    public function cargarMedioPorSistema($parametros = array())
    {
        $parametros['idnomsistemamedio'] = Zend_Json::decode($parametros['idnomsistemamedio']);
        $query = Doctrine_Query::create();
        $query->select(
            'med.idconfmediosistemamedio, med.idindicador, ind.denominacion as denominacion, ind.codigo as codigo '
        )
            ->from('CfgMedioSistemaMedio med')
            ->where('med.idnomsistemamedio = ?', array($parametros['idnomsistemamedio']))
            ->innerJoin('med.NomIndicador ind');
        $this->_logisticaDoctrine->addQueryLimits($query, $parametros);

        return array('cantidad' => $query->count(), 'datos' => $query->fetchArray());
    }

    public function cargarMedios($parametros = array())
    {
        $parametros['idnomsistemamedio'] = Zend_Json::decode($parametros['idnomsistemamedio']);
        if ($parametros['criterio']) {
            $parametros['denominacion'] = $parametros['criterio'];
        }
        $query = Doctrine_Query::create();
        $query->select(
            'med.idconfmediosistemamedio, med.idindicador, ind.denominacion as denominacion, ind.codigo as codigo '
        )
            ->from('CfgMedioSistemaMedio med')
            ->where('med.idnomsistemamedio = ?', array($parametros['idnomsistemamedio']))
            ->innerJoin('med.NomIndicador ind');
        $medAdded = $query->fetchArray();
        if ($medAdded) {
            $idsArray = array();
            foreach ($medAdded as $arr) {
                $idsArray[] = $arr['idindicador'];
            }
            $parametros['idseleccionados'] = json_encode($idsArray);
        }
        $mProducto = new MaestroProductoModel();
        return $mProducto->devolverPadresHojas($parametros);
    }

    public function adicionarSistemaMedio($parametros = array())
    {
        $sistema = new NomSistemaMedio();
        if ($parametros['denominacion']) {
            $datos = Doctrine_Query::create()->select('sis.idnomsistemamedio')
                ->from('NomSistemaMedio sis')->where('denominacion = ?', array($parametros['denominacion']))
                ->fetchArray();
            if (count($datos) > 0) {
                $parametros['idnomsistemamedio'] = $datos[0]['idnomsistemamedio'];
            }
            if ($parametros['idnomsistemamedio']) {
                $sistema->assignIdentifier($parametros['idnomsistemamedio']);
            }
            $sistema->denominacion = $parametros['denominacion'];
            $sistema->activo = 1;
            $sistema->save();
            $sistemaEntidad = new DatSistemaMedioEntidad();
            $datos = Doctrine_Query::create()->select('sme.iddatsistemamedioentidad')
                ->from('DatSistemaMedioEntidad sme')
                ->where('idestructuracomun = ?', array($this->global->Estructura->idestructura))
                ->andWhere('idnomsistemamedio = ? ', array($sistema->idnomsistemamedio))
                ->fetchArray();
            if (count($datos) == 0) {
                $sistemaEntidad->idestructuracomun = $this->global->Estructura->idestructura;
                $sistemaEntidad->idnomsistemamedio = $sistema->idnomsistemamedio;
                $sistemaEntidad->save();
            }
            return true;
        } else {
            return false;
        }
    }

    public function cargarSistemaMedio($parametros = array())
    {
        $query = Doctrine_Query::create();
        $query->select(
            'sis.idnomsistemamedio, sis.denominacion, sis.activo,
            sme.iddatsistemamedioentidad as iddatsistemamedioentidad '
        )
            ->from('NomSistemaMedio sis')->innerJoin('sis.DatSistemaMedioEntidad sme');
        if ($parametros['denominacion']) {
            $query->where('denominacion = ?', array($parametros['denominacion']));
        }
        if ($parametros['idnomsistemamedio']) {
            $query->where('idnomsistemamedio = ?', array($parametros['idnomsistemamedio']));
        }
        if ($parametros['idestructuracomun']) {
            $query->where('sme.idestructuracomun = ?', array($this->global->Estructura->idestructura));
        }
        if ($parametros['dql']) {
            return $query;
        } else {
            $arr = $query->fetchArray();
            foreach ($arr as $index => $sis) {
                $arr[$index]['id'] = $sis['iddatsistemamedioentidad'];
                $arr[$index]['text'] = $sis['denominacion'];
                $arr[$index]['leaf'] = true;
            }
            return $arr;
        }
    }

    public function eliminarSistemaMedio($parametros)
    {
        Doctrine_Query::create()->delete('CfgMedioSistemaMedio')
            ->where('idnomsistemamedio = ?', array($parametros['idnomsistemamedio']))
            ->execute();
        Doctrine_Query::create()->delete('CfgActividadSistemaMedio')
            ->where('idnomsistemamedio = ?', array($parametros['idnomsistemamedio']))
            ->execute();
        return Doctrine_Query::create()->delete('DatSistemaMedioEntidad')
            ->where('iddatsistemamedioentidad =? ', $parametros['iddatsistemamedioentidad'])
            ->execute();
    }

}

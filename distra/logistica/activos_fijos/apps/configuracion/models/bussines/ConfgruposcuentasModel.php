<?php

class ConfgruposcuentasModel extends ZendExt_Model
{
    protected $_sContabilidad, $_sMaestroProd, $_idEstructura, $_configuracionHelper;

    /**
     *
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_sContabilidad = ServiciosContabilidadFinanzasHelper::__init();
        $this->_sMaestroProd = new MaestroProductoService();
        $this->_configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
        $classEstructura = 'Estructura';
        $this->_idEstructura = ZendExt_GlobalConcept::getInstance()->$classEstructura->idestructura;
    }

    /**
     *
     */
    public function getGruposCuentas($parametros)
    {
        $gruposHijos = $this->_sMaestroProd->obteneCualquierGruposHijoPorID($parametros->idgruposubgrupo);

        foreach ($gruposHijos as $index => $row) {
            $concat = $this->getConfGruposCuentas($row['idgruposubgrupo'])[0];
            $row['_is_leaf'] = ($row['ordender'] - $row['ordenizq'] == 1) ? true : false;
            $row['_parent'] = (!$parametros->anode) ? null : $parametros->anode;
            $gruposHijos[$index] = array_merge($row, $concat);
        }

        return $gruposHijos;
    }

    public function getConfGruposCuentas($grupos)
    {
        $query = Doctrine_Query::create()
            ->select(
                'cfgp.idgruposubgrupo, cfgp.idcuentaactivo, cfgp.idcuentadepreciacion, cfgp.idestructura,
                 cfgp.idcuentaactivoalternativa, cfgp.idcuentadepreciacionalternativa,'
            )
            ->from('CfgGruposCuentas cfgp')
            ->whereIn('cfgp.idgruposubgrupo', $grupos)
            ->andWhereIn('cfgp.idestructura', $this->_idEstructura);
        $aux = $query->fetchArray();
        $dualidad = $this->devolverDualidadMonetaria();
        if(count($aux) > 0) {
            foreach ($aux as $index => $row) {
                if ($dualidad['alternativa']) {
                    $denoContable = strtolower($dualidad['monedas']['nomacontable']);
                    $denoAlter = strtolower($dualidad['monedas']['nomalternativa']);

                    $cuentas = $this->_sContabilidad->obtenerCuentaPorId($row['idcuentaactivo']);
                    $aux[$index]['desccuentaActivos'.$denoContable] = $cuentas->text;
                    $cuentas = $this->_sContabilidad->obtenerCuentaPorId($row['idcuentadepreciacion']);
                    $aux[$index]['desccuentaDepreciacion'.$denoContable] = $cuentas->text;
                    $cuentas = $this->_sContabilidad->obtenerCuentaPorId($row['idcuentaactivoalternativa']);
                    $aux[$index]['desccuentaActivos'.$denoAlter] = $cuentas->text;
                    $cuentas = $this->_sContabilidad->obtenerCuentaPorId($row['idcuentadepreciacionalternativa']);
                    $aux[$index]['desccuentaDepreciacion'.$denoAlter] = $cuentas->text;
                } else {
                    $cuentas = $this->_sContabilidad->obtenerCuentaPorId($row['idcuentaactivo']);
                    $aux[$index]['desccuentaActivos'] = $cuentas->text;
                    $cuentas = $this->_sContabilidad->obtenerCuentaPorId($row['idcuentadepreciacion']);
                    $aux[$index]['desccuentaDepreciacion'] = $cuentas->text;
                }
            }
            return $aux;
        } else {
            $array[0] = array();
             return $array;
        }

    }
    /**
     *
     */

    function salvarGruposCuentas($arrGruposCuentas, $idEstructura)
    {
        $collection = new Doctrine_Collection('CfgGruposCuentas');
        foreach ($arrGruposCuentas as $key => $value) {
            $objGrupoCuentas = new CfgGruposCuentas();
            if ($value->idgrupocuenta != '') {
                $objGrupoCuentas->assignIdentifier($value->idgrupocuenta);
                $objGrupoCuentas->synchronizeWithArray($value);
            } else {
                $objGrupoCuentas->idestructura = $idEstructura;
                $objGrupoCuentas->idgruposubgrupo = $value->idgruposubgrupo;
                $objGrupoCuentas->idcuentaactivo =
                    ($value->idcuentaactivo != "") ? $value->idcuentaactivo : null;
                $objGrupoCuentas->idcuentadepreciacion =
                    ($value->idcuentadepreciacion != "") ? $value->idcuentadepreciacion : null;
                $objGrupoCuentas->idcuentaactivoalternativa =
                    ($value->idcuentaactivoalternativa != "") ? $value->idcuentaactivoalternativa : null;
                $objGrupoCuentas->idcuentadepreciacionalternativa =
                    ($value->idcuentadepreciacionalternativa != "") ? $value->idcuentadepreciacionalternativa : null;
            }
            $collection->add($objGrupoCuentas);
        }
        $collection->save();
        return true;
    }

    function devolverDualidadMonetaria()
    {
        $monedas = $this->_configuracionHelper->monedaContableEntidad($this->global->Estructura->idestructura);
        $moneda = array();
        $alternativa = 0;
        foreach ($monedas['datos'] as $index =>$value) {
            if ($value['dualidad'] == 1) {
                $alternativa = 1;
                $moneda['monedaalternativa'] = $value['idmoneda'];
                $moneda['nomalternativa'] = $value['codigoiso'];
            } else {
                $moneda['monedacontable'] = $value['idmoneda'];
                $moneda['nomacontable'] = $value['codigoiso'];
            }
        }
        return array('alternativa' => $alternativa, 'monedas' => $moneda);
    }

}

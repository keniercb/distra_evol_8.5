<?php

/**
 * Class EstructurayComposicionService
 */
class EyCServices
{
    /**
     * @var
     */
    private $inyector;

    /**
     *
     */
    function __construct()
    {
        $this->inyector = ZendExt_IoC::getInstance();
    }

    /**
     * @param $id
     *
     * @return mixed
     * @throws Exception
     */
    public function getHijosEstructura($id)
    {
        try {
            return $this->inyector->metadatos->DameHijosEstructura($id);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $id
     *
     * @return mixed
     * @throws Exception
     */
    public function getEstructura($id)
    {
        try {
            return $this->inyector->metadatos->DameEstructura($id);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $id
     *
     * @return mixed
     * @throws Exception
     */
    public function getCargosByEstructura($id)
    {
        try {
            return $this->inyector->metadatos->obtenerCargosEstructura($id, true, false);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getNomMilitaryDegrees(
        $start = null, $limit = null, $idGrado = null, $idCategoriaMilitar = null, $esMarina = 2
    )
    {
        try {
            return $this->inyector->metadatos->buscarGradoMilitar($start, $limit, $idGrado, $idCategoriaMilitar, $esMarina);
        } catch (Exception $e) {
            throw $e;
        }

    }

    public function getDatosCargo($id)
    {
        try {
            return $this->inyector->metadatos->obtenerDatosCargo($id);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function agregarDQLDatosCargo(
        Doctrine_Query $objDoctrineQuery, $aliasTablaReferencia, $aliasTabla, $relation, $includeDqlSelect = false
    )
    {
        try {
            return $this->inyector->metadatos->agregarDqlDatosCargo(
                $objDoctrineQuery, $aliasTablaReferencia, $aliasTabla, $relation, $includeDqlSelect
            );
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getRutaEstructura(array $id)
    {
        try {
            return $this->inyector->metadatos->getRutaEstructura($id);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function obtenerIUEstructura()
    {
        try {
            return $this->inyector->metadatos->obtenerIUEstructura();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function syncCompletamientoCargo($idcargo, $cant)
    {
        try {
            return $this->inyector->metadatos->registrarAltasBajas($idcargo, $cant);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function BuscarEntidadbyDominio($idestructura)
    {
        try {
            return $this->inyector->metadatos->BuscarEntidadbyDominio($idestructura);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getAllCargos($valor, $limit, $start)
    {
        try {
            return $this->inyector->metadatos->buscarCargo($valor, $limit, $start);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getRoot($id)
    {
        //$root = $this->inyector->metadatos->getEstructura($id);
        $root = $this->getEstructura($id);
        $array = array();
        foreach ($root as $v) {
            $p = count($array);
            $array[$p]->id = $v->idestructura;
            $array[$p]->text = $v->denominacion;
            $array[$p]->codigo = $v->codigo;
            $array[$p]->_parent = $v->idpadre;
            $array[$p]->expanded = true;
            $array[$p]->tipo_concepto = $v->concepto;
            $array[$p]->idconcepto = $v->idconcepto;
            $array[$p]->icon = $v->icon;
            $array[$p]->children = $this->getEstructuraHijas($v->idestructura);
        }
        return $array;
    }

    /**
     *
     */
    public function getEstructuraHijas($id, $ext = false)
    {
        //$arrEntidad = $this->inyector->metadatos->getHijosEstructura($id);
        $arrEntidad = $this->getHijosEstructura($id);

        $array = array();
        foreach ($arrEntidad as $v) {
            $p = count($array);
            $array[$p] = $v;
            if ($v->cantidad != '' && $v->cantidad_real != '') {
                $array[$p]->text = $v->text . " <b>($v->cantidad | $v->cantidad_real)</b>";

            }
            /*if ($v->idconcepto == 7 || $v->idconcepto == 10) {

                $pers = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersonaSIAC(null, null, null, null, null, $v->id);
                $cant = $v->cantidad - count($pers);
                foreach ($pers->data as $per => $b) {
                    $grado = ZendExt_IoC::getInstance()->metadatos->dameGrado($b['idgrado']);
                    $personas[$per]['text'] = $grado[0]['grado'] . ' ' . $b['nombreapellidos'];
                    $personas[$per]['idpersona'] = $b['idpersona'];
                    $personas[$per]['nombre'] = $b['nombreapellidos'];
                    $personas[$per]['grado'] = $grado[0]['grado'];
                    $personas[$per]['icon'] = $b['foto'] ? 'data:image/jpg;base64,' . $b['foto'] : '/pvd/persona/views/images/persona/no-photo-male.png';
                    $personas[$per]['leaf'] = true;
                    $array[$p]->children = $personas;

                }
                $array[$p]->leaf = false;
            }*/
        }
        return $array;

    }
}
<?php

/**
 * Gestiona los filtros usados en la compartimentacion por roles
 * Class SegFiltroModel
 *
 * @author Javier Rodriguez Lopez
 */
class SegFiltroModel extends ZendExt_Model
{

    private $objSegCampo;

    public function SegFiltroModel()
    {
        parent::ZendExt_Model();
        $this->objSegCampo = new SegCampo();
    }

    /**
     * Adiciona o modifica un filtro a la compartimentacion
     *
     * @param      $idcampo
     * @param      $idrol
     * @param      $condicion
     * @param      $valor
     * @param      $logico
     * @param null $idfiltro
     *
     * @return mixed
     */
    public function saveFiltro($idcampo, $idrol, $condicion, $valor, $valormostrar, $logico, $idfiltro = null, $orden = 0)
    {
        try {
            $objFiltro = new SegFiltro();

            if (!empty($idfiltro)) {
                $objFiltro = $objFiltro->getFiltro($idfiltro);
            }
            $objFiltro->idcampo = $idcampo;
            $objFiltro->idrol = $idrol;
            $objFiltro->condicion = $condicion;
            $objFiltro->valor = $valor;
            $objFiltro->valormostrar = $valormostrar;
            $objFiltro->logico = $logico;
            $objFiltro->orden = $orden;
            $objFiltro->save();

            $r['idfiltro'] = $objFiltro->idfiltro;
            $r['success'] = true;

            return $r;
        } catch (Exception $e) {
            $r['success'] = false;
            $r['errorMsg'] = $e->getMessage();

            return $r;
        }
    }

    /**
     * Elimina un filtro de la compartimentacion
     *
     * @param $idfiltro
     *
     * @return mixed
     */
    public function delFiltro($idfiltro)
    {
        try {
            $q = Doctrine_Query::create()
                ->delete('SegFiltro')
                ->where('idfiltro = ?', $idfiltro)
                ->execute();

            $r['success'] = true;

            return $r;
        } catch (Exception $e) {
            $r['success'] = false;
            $r['errorMsg'] = $e->getMessage();

            return $r;
        }
    }
}
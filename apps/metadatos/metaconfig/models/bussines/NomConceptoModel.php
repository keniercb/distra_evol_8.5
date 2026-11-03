<?php

/**
 * Class NomConceptoModel
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
class NomConceptoModel extends ZendExt_Model
{
    /**
     *
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->instance = new NomConcepto();
    }

    /**
     * Descripción del método: Obtiene los Concepto que pueden ser graficados
     *
     * @author    : Ing. Pedro Alberto Jiménez Alonso.
     * @return array, Retorna los conceptos de la tabla que tienen valor true en el campo esGrafica
     * @copyright Copyright (c) 2013 xetid
     */
    public static function dameConceptosGraficables()
    {
        $query = Doctrine_Query::create();
        $perfil = Util::getPerfilGlobal();
        $dominio = $perfil->iddominio;
        $result = $query->select('n.*')->addSelect(
                        "
                                                (CASE
                                                  WHEN n.idconcepto = 7 THEN 'Cargo' ELSE n.denominacion
                                                END) as denominacion
                                              "
        )->from('Nomconcepto n')->where('n.grafica = 1 AND n.idconcepto <> 10')->addWhere(
                        "(
                        SELECT COUNT(fila.idfila)
                        FROM NomFilaestruc fila
                        WHERE fila.fechafin IS NULL AND fila.dominiofila [$dominio]=1::bit AND
                              fila.idconcepto = n.idconcepto
                      ) > 0"
            )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        return $result;
    }

    /**
     * Descripción del método: Modifica de un concepto determinado el dirIcono correspondiente y su propiedad
     * de graficable
     *
     * @author    : Ing.Osvaldo Gonzalez
     *
     * @param $idConcepto
     * @param $idIcono
     * @param $esGrafica
     *
     * @return bool Retorna TRUE/FALSE en caso de modificar correctamente o no
     * @copyright Copyright (c) 2013 xetid
     */
    public function modificar($idConcepto, $idIcono, $esGrafica = 0)
    {
        $this->instance = Doctrine::getTable('NomConcepto')->find($idConcepto);
        if (is_object($this->instance)) {
            $this->instance->idicono = $idIcono;
            $this->instance->grafica = ($esGrafica == 'true') ? 1 : 0;
            $this->instance->save();

            return true;
        }

        return false;
    }

    /**
     * @return mixed
     */
    public function obtenerConceptosIconos()
    {
        $query = Doctrine_Query::create();
        $query->select('c.denominacion as text, c.*')->from('NomConcepto c')->orderBy('c.orden');
        $query = $this->integrator->metadatos->getSqlIconos($query);
        $result = $query->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        return $result;
    }
}
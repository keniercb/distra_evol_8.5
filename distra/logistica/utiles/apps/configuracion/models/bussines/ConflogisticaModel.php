<?php

/**
 * @author Maricet Estevez
 * 11-01-2013
 */
class ConflogisticaModel extends ZendExt_Model
{
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    /**
     * Metodo para obtener los periodo segun una configuracion
     * @param numeric $cfgperido
     * @param Doctrine_Query $query [Opcional] Determina si se devuelve la consulta 
     * (hay que especificar la tabla root).
     * @param string $aliasExt [Opcional] Alias externo.
     * @result array|Doctrine_Query
     */
    public function getPeriodoConfigurado($cfgperido, $query = null, $aliasExt = 'te')
    {
        $seleecion = "np.idperiodo, np.denominacion, np.abreviatura, np.mesinicial, np.mesfinal, "
            . "np.idcfgperiodo AS idcfgperiodo, cfp.longitud AS longitud, cfp.denominacion AS denperiodo";
        if ($query) {
            $query->addSelect($seleecion)
                ->innerJoin("{$aliasExt}.NomPeriodo np")
                ->innerJoin("np.CfgPeriodo cfp");
            return $query;
        }
        $query = Doctrine_Query::create()
            ->select($seleecion)
            ->from("NomPeriodo np")
            ->innerJoin("np.CfgPeriodo cfp")
            ->where("cfp.longitud = ?", $cfgperido)
            ->orderBy('np.idperiodo');
        return array('cantidad' => $query->count(), 'datos' => $query->fetchArray());
    }

}

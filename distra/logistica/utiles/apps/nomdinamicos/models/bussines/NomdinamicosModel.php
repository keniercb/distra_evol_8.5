<?php

/**
 * @class     NomdinamicosModel
 * @package
 * @author    Osleidy Quiala
 * @copyright 2017 XETID
 * @version   1.0
 */
class NomdinamicosModel extends BaseModel
{
    private $serviceAtributo;

    /**
     * Contructor de la clase.
     */
    public function __construct()
    {
        parent::__construct();
        $this->serviceAtributo = new AtributosdinamicosxService();
    }

    /**
     * Devuelve los tipo de nomenclador.
     * @param array $filtro
     * @param boolean $dql
     * @return array|Doctrine_Query
     */
    public function cargarNomDinamicos($filtro, $dql = false)
    {
        $query = Doctrine_Query::create()
            ->select('n.idtiponomenclador, n.denominacion, n.propiedades, n.activo')
            ->from('NomTipoNomenclador n')
            ->orderBy('n.idtiponomenclador');
        if ($filtro['criterio']) {
            $query->where("n.denominacion ILIKE '%{$filtro['criterio']}%'");
        }
        if ($dql) {
            return $query;
        }
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $filtro)->fetchArray()
        );
    }

    public function getNomDinamicos($dql = false)
    {
        $query = Doctrine_Query::create()
            ->select('n.idtiponomenclador, n.denominacion, n.idtiponomenclador AS idtiponomenclador, n.propiedades')
            ->from('NomTipoNomenclador n');
        if ($dql) {
            return $query;
        }
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $filtro)->fetchArray()
        );
    }

    /**
     * Adiciona un nomenclador dinamico.
     * @param array $datos
     * @return array
     */
    public function adicionarNomDinamico($datos)
    {
        $record = new NomTipoNomenclador();
        if ($datos['idtiponomenclador']) {
            $record->assignIdentifier($datos['idtiponomenclador']);
        }
        $datos['propiedades'] = json_decode($datos['propiedades']);
        $record->synchronizeWithArray($datos);
        $record->save();
        return array('idtiponomenclador' => $record->idtiponomenclador);
    }

    public function existeNomenclador($filtro)
    {
        $query = Doctrine_Query::create()
            ->select('n.idtiponomenclador')
            ->from('NomTipoNomenclador n')
            ->where("n.denominacion ILIKE '{$filtro['denominacion']}'");
        if ($filtro['idtiponomenclador']) {
            $query->whereNotIn('n.idtiponomenclador', $filtro['idtiponomenclador']);
        }
        return $query->count() > 0;
    }

    public function eliminarNomDinamicos($idnomecladores)
    {
        Doctrine_Query::create()
            ->delete('NomTipoNomenclador')
            ->whereIn('idtiponomenclador', $idnomecladores)
            ->execute();
        return true;
    }

    public function nomencladoresEnUso($idnomecladores)
    {
        $query = Doctrine_Query::create()
            ->from('DatTablaMeta')
            ->where(
                "esquema = 'mod_logmetadata' AND tabla = 'nom_tiponomenclador' AND columnaref = 'idtiponomenclador'"
            )
            ->whereIn('datoref', $idnomecladores);
        return $query->count() > 0;
    }

    public function cargarDatosNom($filtro, $dql = false)
    {

        $query = Doctrine_Query::create()
            ->select('n.idnomenclador, n.idtiponomenclador, n.denominacion, n.referencia, n.propiedades')
            ->from('DatNomenclador n')
            ->where('n.idtiponomenclador = ?', $filtro['idtiponomenclador'])
            ->orderBy('n.idnomenclador');
        if ($filtro['criterio']) {
            $query->addWhere("n.denominacion ILIKE '%{$filtro['criterio']}%'");
        }
        if ($filtro['query']) {
            $query->addWhere("n.denominacion LIKE '{$filtro['query']}%'");
        }
        if ($dql) {
            return $query;
        }
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $filtro)->fetchArray()
        );

    }

    public function savePropiedades($datos)
    {
        $json = $this->serviceAtributo->getAtribPropiedades($datos);
        $nom = Doctrine::getTable('NomTipoNomenclador')->find($datos['datoref']);
        $nom->propiedades = $json;
        $nom->save();
    }

    public function adicionarDato($datos)
    {
        foreach ($datos['nomencladores'] as $value) {
            if ($this->existeDato($value) == false) {
                $record = new DatNomenclador();
                if ($value['idnomenclador']) {
                    $record->assignIdentifier($value['idnomenclador']);
                }
                $value['propiedades'] = Zend_Json::encode($value);
                $record->synchronizeWithArray($value);
                $record->save();
            }
        }
    }

    private function existeDato($filtro)
    {
        $query = Doctrine_Query::create()
            ->select('d.idnomenclador')
            ->from('DatNomenclador d')
            ->where(
                "d.referencia = ?",
                array($filtro['referencia'])
            );
        if ($filtro['idnomenclador']) {
            $query->addWhere('d.idtiponomenclador = ?', $filtro['idtiponomenclador']);
        }
        return $query->count() > 0;
    }

    public function eliminarDato($params)
    {
        if (isset($params[0])) {
            Doctrine_Query::create()->delete('DatNomenclador')->whereIn(
                'idnomenclador ', $params
            )->execute();
        }
    }

    public function cargarTallasNom($filtro, $dql = false)
    {
        $filtro['idtiponomenclador'] = 1000000002;
        $query = Doctrine_Query::create()
            ->select('n.idnomenclador, n.idtiponomenclador, n.denominacion, n.referencia, n.propiedades')
            ->from('DatNomenclador n')
            ->where('idtiponomenclador = ?', $filtro['idtiponomenclador']);
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $filtro)->fetchArray()
        );
    }


}

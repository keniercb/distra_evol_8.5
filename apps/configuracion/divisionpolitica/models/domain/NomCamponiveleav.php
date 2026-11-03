<?php

/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Domain
 * @version    1.0
 */
class NomCamponiveleav extends BaseNomCamponiveleav
{

    public function setUp()
    {
        parent::setUp();
        $this->HasMany('NomValorDefectoeav', array('local' => 'idcampo', 'foreign' => 'idcampo'));
        $this->hasOne('NomConcept', array('local' => 'idconceptoestructural', 'foreign' => 'idconceptoestructural'));
    }

    /**
     * Para mostrar los campos EAV
     *
     * @param int $limit   Límite superior
     * @param int $start   Comienzo inferior
     * @param int $idtabla Identificador de tabla
     *
     * @author Livan A Capote Valdes
     * @return array
     */
    static function buscarCampos($limit, $start, $idtabla)
    {
        $query = Doctrine_Query::create();
        $result = $query->select(
            'a.idcampo,a.idconceptoestructural,a.nombre,a.tipo,a.longitud,
             a.nombre_mostrar,a.regex,a.descripcion,a.tipocampo,a.visible,a.actual,a.obligatorio,a.eliminable,a.orden'
        )
            ->from('NomCamponiveleav a')
            ->where("idconceptoestructural='$idtabla'")
            ->limit($limit)
            ->offset($start)
            ->execute()
            ->toArray();
        return $result;
    }

}

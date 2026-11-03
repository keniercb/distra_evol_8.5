<?php

/**
 * SegBloqueoip
 *
 * Clase de acceso a dato a la entidad seg_bloqueoip.
 *
 * @package    seguridad
 * @author     Equipo de seguridad UCID
 * @version    SVN: $Id: Builder.php 6820 2009-11-30 17:27:49Z jwage $
 */
class SegBloqueoip extends BaseSegBloqueoip
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'SegBloqueo', 
            array('local' => 'idbloqueo', 'foreign' => 'idbloqueo')
        );
    }

    /**
     * Funcion usada para obtener el listado de usuarios bloqueados.
     *
     * @param integer $limit Limite para el paginado.
     * @param integer $start Comienzo del paginado.
     * @param integer $iddominio Identificador del dominio.
     * @param string $string Cadena de busqueda.
     *
     * @return array Arreglo asociativo con los datos de los 
     * usuarios bloqueados.
     */
    public static function obtenerIpBloqueados(
        $limit = 10, $start = 0, $string = NULL
    )
    {
        $query = Doctrine_Query::create();
        if ($string != NULL)
            $query->addWhere(
                "bi.ip LIKE '%$string%' OR b.fecha :: varchar LIKE '%$string%' "
                . "OR b.hora :: varchar LIKE '%$string%' "
                . "OR b.intento :: varchar LIKE '%$string%'"
            );
        return $query->select(
            'b.idbloqueo, b.fecha, b.hora, b.intento, '
            . 'bi.ip as ip, bi.idbloqueo as id'
        )
            ->from('SegBloqueo b')
            ->innerjoin('b.SegBloqueoip bi ON (b.idbloqueo = bi.idbloqueo)')
            ->limit($limit)
            ->offset($start)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * Funcion usada para devolver la cantidad de usuarios bloqueados.
     *
     * @param array $arrayIdDominio Listado de identificadores de dominio 
     * usados para la compartimentacion
     * @param string $string Cadena de busqueda.
     * @return integer Cantidad de usuarios bloqueados.
     */
    public static function cantIpBloqueados($string = NULL)
    {
        $query = Doctrine_Query::create();
        if ($string != NULL)
            $query->addWhere(
                "bi.ip LIKE '%$string%' OR b.fecha :: varchar LIKE '%$string%' "
                . "OR b.hora :: varchar LIKE '%$string%' "
                . "OR b.intento :: varchar LIKE '%$string%'"
            );
        return $query->from('SegBloqueo b')
            ->innerjoin('b.SegBloqueoip bi ON (b.idbloqueo = bi.idbloqueo)')
            ->count();
    }
}
<?php

/**
 * @name SegRestricclaveacceso - Componente de acceso a datos de 
 * configuracion de claves.
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class SegRestricclaveacceso extends BaseSegRestricclaveacceso
{

    public function setUp()
    {
        parent::setUp();
    }

    /**
     * @method cargarclave($limit, $start) - Función usada para listar la 
     * configuración de la clave.
     * @param integer $limit - Limite.
     * @param integer $start - Comienzo.
     * @return Array.
     */
    static public function cargarclave($limit, $start)
    {
        $query = Doctrine_Query::create();
        $fndes = $query->select(
            'a.idrestricclaveacceso,a.minimocaracter as minimocaracteres,
            a.numerica,a.signo, a.alfabetica,a.diascaducidad, 
            a.historico as historicoPass, a.mayuscula'
        )
            ->from('SegRestricclaveacceso a')
            ->orderby('idrestricclaveacceso')
            ->limit($limit)
            ->offset($start)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $fndes;
    }

    /**
     * @method obtenerclave() - Función que retorna la cantidad de claves.
     * @return integer - Cantidad de claves.
     */
    static function obtenerclave()
    {
        $query = Doctrine_Query::create();
        $cantFndes = $query->select('COUNT(a.idrestricclaveacceso) cant')
            ->from('SegRestricclaveacceso a')
            ->execute();
        return $cantFndes[0]['cant'];
    }

}
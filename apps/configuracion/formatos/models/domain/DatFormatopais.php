<?php

/**
 * Componente para gestionar las los formatos de las entidades.
 *
 * @package    Configuración
 * @subpackage Formatos/Models/Domain
 * @copyright  XETID
 * @version    1.0
 */
class DatFormatopais extends BaseDatFormatopais
{

    /**
     * Constuctor de la clase
     */
    public function setUp() 
    {
        $this->hasOne('DatFormato', array('local' => 'idformato', 'foreign' => 'idformato'));
        parent::setUp();
    }

    /**
     * Formato parrafo país
     * 
     * @return array Retorna un arreglo con los datos del formato 
     */
    public function FormatoParrafoPais() 
    {
        $q = Doctrine_Query::create();
        $formatos = $q->select(
                "fp.idformato,f.nombre,f.descripcion,f.separador,
                    pf.idparteformato,pf.nombre,pf.abreviatura,pf.nivel,pf.longitud"
                )
                ->from('DatFormatopais fp')
                ->innerJoin("fp.DatFormato f")
                ->innerJoin("f.DatParteformato pf")
                ->where("fp.idformatopais = ?", 1)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $formatos;
    }

}

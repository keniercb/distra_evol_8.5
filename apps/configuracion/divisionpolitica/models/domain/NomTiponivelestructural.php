<?php

/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Domain
 * @version    1.0
 */
class NomTiponivelestructural extends BaseNomTiponivelestructural
{
    public function setUp()
    {
        parent::setUp();

        $this->hasOne(
            'NomConceptoestructural', array('local' => 'idconceptoestructural', 'foreign' => 'idconceptoestructural')
        );
    }

} 
 

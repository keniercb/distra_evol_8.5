<?php
class DatExcluido extends BaseDatExcluido
{
	public function setUp()
    {
        parent :: setUp();
    }		
	
	public function getById($idexcluido)
    {
        return Doctrine::getTable('DatExcluido')->find($idexcluido);
    }
}
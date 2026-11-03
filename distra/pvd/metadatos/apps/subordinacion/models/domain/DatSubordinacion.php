<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @property  idnomsubordinacion
 * @property  idpadre
 * @property  idhijo
 * @property  idpadre
 * @property  idnomsubordinacion
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
class DatSubordinacion extends BaseDatSubordinacion
{
    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        /** @noinspection PhpTraditionalSyntaxArrayLiteralInspection */
        $this->hasOne('NomSubordinacion', ['local' => 'idnomsubordinacion', 'foreign' => 'idnomsubordinacion']);
        $this->hasOne('NomFilaestruc', ['local' => 'idhijo', 'foreign' => 'idfila']);
    }
}
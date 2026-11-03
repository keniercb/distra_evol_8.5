<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of PluginActivotransporteModel
 *
 * @author Gerardo
 */
class PluginConfiguracionTipomediotransporteModel extends BaseModel implements ICompositeModel
{

    public function addJoinModel(Doctrine_Query $query, $aliasExterno, $aliasLocal, $includeSelect = true,
        $parametros = array())
    {
        //carga si esta activa  la opcion de transporte
        $obj = new ConfparametrosgeneralesModel();
        $activTransporte = $obj->getConfiguracionPG(null, 0);

        if ($activTransporte[0]['transporte']) {
            $query->leftJoin("$aliasExterno.CfgTipoMedioTransp $aliasLocal");
            if ($includeSelect) {
                $query->addSelect($this->getQuerySelectFields($aliasLocal));
            }
        }
    }

    public function addQueryFilters(Doctrine_Query $query, $aliasTabla, $parametros = array())
    {
        return $query;
    }

    public function beforeDelete($identifier)
    {
        return;
    }

    public function beforeSave(Doctrine_Record $model, $parametros = array())
    {
        $model->CfgTipoMedioTransp->synchronizeWithArray($parametros);
    }

    public function getQuerySelectFields($alias)
    {
        $arrayQueryStrings = array(
            'numchasis' => '_p.numchasis',
            'nummatricula' => '_p.nummatricula',
            'numcirculacion' => '_p.numcirculacion',
            'motor1' => '_p.motor1',
            'motor2' => '_p.motor2',
            'tipocombustible' => '_p.tipocombustible',
            'indicativo' => '_p.indicativo',
            'indiceconsumo' => '_p.indiceconsumo',
            'lot' => '_p.lot',
            'capacidad' => '_p.capacidad',
            'endeposito' => '_p.endeposito',
            'vin' => '_p.vin',
            'ficav' => '_p.ficav',
            'nrollaveencendido' => '_p.nrollaveencendido',
            'vencimientoficav' => '_p.vencimientoficav',
            'vencimientolot' => '_p.vencimientolot',
            'expedicioncirculacion' => '_p.expedicioncirculacion',
            'vencimientocirculacion' => '_p.vencimientocirculacion',
            'normacombustible' => '_p.normacombustible',
            'cantpersonasentado' => '_p.cantpersonasentado',
            'cantpersonapie' => '_p.cantpersonapie',
            'idgps' => '_p.idgps',
            'idcategoriatransp' => '_p.idcategoriatransp',
            'kmasignado' => '_p.kmasignado'
        );
        return $this->doctrineHelper->getStrSelectString($arrayQueryStrings, $alias, '_p');
    }

    public function initBaseRelation(Doctrine_Record $ConfTipoMedio)
    {
        $array[] = array('cardinalidad' => 'one',
            'relation' => 'CfgTipoMedioTransp',
            'properties' => array('local' => 'idtipomedio', 'foreign' => 'idtipomediotransp'));

        LogisticaDoctrineHelper::__init()->tryInyectRelactions($ConfTipoMedio, $array);
    }

    public function getArrayColumnasVacias($parametros)
    {
        $newArray = array(
            'numchasis' => 0,
            'nummatricula' => 0,
            'numcirculacion' => 0,
            'motor1' => 0,
            'motor2' => 0,
            'tipocombustible' => 0,
            'indicativo' => 0,
            'indiceconsumo' => 0,
            'nrollaveencendido' => 0,
            'ficav' => 0,
            'lot' => 0,
            'capacidad' => 0,
            'endeposito' => 0,
            'vin' => 0,
            'vencimientoficav' => 0,
            'vencimientolot' => 0,
            'expedicioncirculacion' => 0,
            'vencimientocirculacion' => 0,
            'normacombustible' => 0,
            'cantpersonasentado' => 0,
            'cantpersonapie' => 0,
            'idgps' => 0,
            'idcategoriatransp' => 0,
            'kmasignado' => 0
        );
        return array_merge($parametros, $newArray);
    }

    public function getLabelNameObjectsFromData($data, &$result)
    {
        foreach ($data as $artib => $valor) {
            if ($valor[$artib] == 1) {
                if ($artib == 'nummatricula') {
                    $obj = new stdClass();
                    $obj->label = 'No matr&iacute;cula';
                    $obj->name = 'nromatricula';
                    $obj->descripcion = 'No matrícula';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos de transporte";
                    $obj->idPlugin = "transporte";
                    $obj->allowBlank = true;
                    $obj->tipo = 'textfield';
                    array_push($result, $obj);
                }
                if ($artib == 'numchasis') {
                    $obj = new stdClass();
                    $obj->label = 'No chasis';
                    $obj->name = 'nrochasis';
                    $obj->descripcion = 'No chasis';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos de transporte";
                    $obj->idPlugin = "transporte";
                    $obj->allowBlank = true;
                    $obj->tipo = 'textfield';
                    array_push($result, $obj);
                }
                if ($artib == 'numcirculacion') {
                    $obj = new stdClass();
                    $obj->label = 'No circulaci&oacute;n';
                    $obj->descripcion = 'No circulación';
                    $obj->name = 'nrocirculacion';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos de transporte";
                    $obj->idPlugin = "transporte";
                    $obj->allowBlank = true;
                    $obj->tipo = 'textfield';
                    array_push($result, $obj);
                }
                if ($artib == 'motor2') {
                    $obj = new stdClass();
                    $obj->label = 'No motor2';
                    $obj->name = 'nromotor2';
                    $obj->descripcion = 'No motor2';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos de transporte";
                    $obj->idPlugin = "transporte";
                    $obj->allowBlank = true;
                    $obj->tipo = 'textfield';
                    array_push($result, $obj);
                }
                if ($artib == 'motor1') {
                    $obj = new stdClass();
                    $obj->label = 'No motor1';
                    $obj->descripcion = 'No motor1';
                    $obj->name = 'nromotor1';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos de transporte";
                    $obj->idPlugin = "transporte";
                    $obj->allowBlank = true;
                    $obj->tipo = 'textfield';
                    array_push($result, $obj);
                }
                if ($artib == 'tipocombustible') {
                    $obj = new stdClass();
                    $obj->label = 'Tipo de combustible';
                    $obj->name = 'idtipocombustible';
                    $obj->descripcion = 'Tipo de combustible';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos de transporte";
                    $obj->idPlugin = "transporte";
                    $obj->allowBlank = true;
                    $obj->tipo = 'combo';
                    array_push($result, $obj);
                }
                if ($artib == 'indicativo') {
                    $obj = new stdClass();
                    $obj->label = 'Indicativo';
                    $obj->descripcion = 'Indicativo';
                    $obj->name = 'indicativo';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos de transporte";
                    $obj->idPlugin = "transporte";
                    $obj->allowBlank = true;
                    $obj->tipo = 'textfield';
                    array_push($result, $obj);
                }
                if ($artib == 'indiceconsumo') {
                    $obj = new stdClass();
                    $obj->label = 'Indice de consumo';
                    $obj->name = 'indiceconsumo';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos de transporte";
                    $obj->idPlugin = "transporte";
                    $obj->allowBlank = true;
                    $obj->tipo = 'numberfield';
                    array_push($result, $obj);
                }              
                if ($artib == 'nrollaveencendido') {
                    $obj = new stdClass();
                    $obj->label = 'No llave de encendido';
                    $obj->descripcion = 'No llave de encendido';
                    $obj->name = 'nollaveencendido';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos de transporte";
                    $obj->idPlugin = "transporte";
                    $obj->allowBlank = true;
                    $obj->tipo = 'textfield';
                    array_push($result, $obj);
                }
                if ($artib == 'ficav') {
                    $obj = new stdClass();
                    $obj->label = 'FICAV';
                    $obj->descripcion = 'FICAV';
                    $obj->name = 'ficav';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos de transporte";
                    $obj->idPlugin = "transporte";
                    $obj->allowBlank = true;
                    $obj->tipo = 'date';
                    array_push($result, $obj);
                }
                if ($artib == 'lot') {
                    $obj = new stdClass();
                    $obj->label = 'LOT';
                    $obj->descripcion = 'LOT';
                    $obj->name = 'lot';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos de transporte";
                    $obj->idPlugin = "transporte";
                    $obj->allowBlank = true;
                    $obj->tipo = 'date';
                    array_push($result, $obj);
                }
                if ($artib == 'capacidad') {
                    $obj = new stdClass();
                    $obj->label = 'Capacidad de carga';
                    $obj->descripcion = 'Capacidad de carga';
                    $obj->name = 'capacidad';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos de transporte";
                    $obj->idPlugin = "transporte";
                    $obj->allowBlank = true;
                    $obj->tipo = 'numberfield';
                    array_push($result, $obj);
                }
                if ($artib == 'endeposito') {
                    $obj = new stdClass();
                    $obj->label = 'En dep\xf3sito';
                    $obj->descripcion = 'En dep\xf3sito';
                    $obj->name = 'endeposito';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos de transporte";
                    $obj->idPlugin = "transporte";
                    $obj->allowBlank = true;
                    $obj->tipo = 'numberfield';
                    array_push($result, $obj);
                }
                if ($artib == 'vin') {
                    $obj = new stdClass();
                    $obj->label = 'VIN';
                    $obj->descripcion = 'VIN';
                    $obj->name = 'vin';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos de transporte";
                    $obj->idPlugin = "transporte";
                    $obj->allowBlank = true;
                    $obj->tipo = 'textfield';
                    array_push($result, $obj);
                }
                if ($artib == 'nollaveencendido') {
                    $obj = new stdClass();
                    $obj->label = 'N.° llave de encendido';
                    $obj->descripcion = 'N.° llave de encendido';
                    $obj->name = 'nollaveencendido';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos de transporte";
                    $obj->idPlugin = "transporte";
                    $obj->allowBlank = true;
                    $obj->tipo = 'textfield';
                    array_push($result, $obj);
                }
                if ($artib == 'combustibleasignado') {
                    $obj = new stdClass();
                    $obj->label = 'Combustible asignado';
                    $obj->descripcion = 'Combustible asignado';
                    $obj->name = 'combustibleasignado';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos de transporte";
                    $obj->idPlugin = "transporte";
                    $obj->allowBlank = true;
                    $obj->tipo = 'numberfield';
                    array_push($result, $obj);
                }if ($artib == 'kmasignado') {
                    $obj = new stdClass();
                    $obj->label = 'KM asignado';
                    $obj->descripcion = 'KM asignado';
                    $obj->name = 'kmasignado';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos de transporte";
                    $obj->idPlugin = "transporte";
                    $obj->allowBlank = true;
                    $obj->tipo = 'numberfield';
                    array_push($result, $obj);
                }
                if ($artib == 'vencimientoficav') {
                    $obj = new stdClass();
                    $obj->label = 'Fecha vencimiento ficav';
                    $obj->descripcion = 'Fecha vencimiento ficav';
                    $obj->name = 'vencimientoficav';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos de transporte";
                    $obj->idPlugin = "transporte";
                    $obj->allowBlank = true;
                    $obj->tipo = 'date';
                    array_push($result, $obj);
                }
                if ($artib == 'vencimientolot') {
                    $obj = new stdClass();
                    $obj->label = 'Fecha vencimiento lot';
                    $obj->descripcion = 'Fecha vencimiento lot';
                    $obj->name = 'vencimientolot';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos de transporte";
                    $obj->idPlugin = "transporte";
                    $obj->allowBlank = true;
                    $obj->tipo = 'date';
                    array_push($result, $obj);
                }
                if ($artib == 'expedicioncirculacion') {
                    $obj = new stdClass();
                    $obj->label = 'Fecha expedici\xf3n circulaci&oacute;n';
                    $obj->name = 'expedicioncirculacion';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos de transporte";
                    $obj->idPlugin = "transporte";
                    $obj->allowBlank = true;
                    array_push($result, $obj);
                }
                if ($artib == 'vencimientocirculacion') {
                    $obj = new stdClass();
                    $obj->label = 'Fecha vencimiento circulaci&oacute;n';
                    $obj->descripcion = 'Fecha vencimiento circulación';
                    $obj->name = 'vencimientocirculacion';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos de transporte";
                    $obj->idPlugin = "transporte";
                    $obj->allowBlank = true;
                    array_push($result, $obj);
                }
                if ($artib == 'cantpersonapie') {
                    $obj = new stdClass();
                    $obj->label = 'Cantidad de personas de pie';
                    $obj->name = 'cantpersonapie';
                    $obj->descripcion = 'Cantidad de personas de pie';
                    $obj->allowBlank = true;
                    $obj->idPlugin = "transporte";
                    $obj->ownerPlugins = true;
                    $obj->tipo = 'numberfield';
                    array_push($result, $obj);
                }
                if ($artib == 'cantpersonasentado') {
                    $obj = new stdClass();
                    $obj->label = 'Cantidad de personas sentadas';
                    $obj->name = 'cantpersonasentado';
                    $obj->descripcion = 'Cantidad de personas sentadas';
                    $obj->allowBlank = true;
                    $obj->idPlugin = "transporte";
                    $obj->ownerPlugins = true;
                    $obj->tipo = 'numberfield';
                    array_push($result, $obj);
                }
                if ($artib == 'normacombustible') {
                    $obj = new stdClass();
                    $obj->label = 'Norma de combustible';
                    $obj->name = 'normacombustible';
                    $obj->descripcion = 'Norma de combustible';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Norma de combustible";
                    $obj->idPlugin = "transporte";
                    $obj->allowBlank = true;
                    $obj->tipo = 'numberfield';
                    array_push($result, $obj);
                }
                if ($artib == 'idgps') {
                    $obj = new stdClass();
                    $obj->label = 'GPS';
                    $obj->descripcion = 'GPS';
                    $obj->name = 'idgps';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos de transporte";
                    $obj->idPlugin = "transporte";
                    $obj->allowBlank = true;
                    $obj->tipo = 'textfield';
                    array_push($result, $obj);
                }
                if ($artib == 'idcategoriatransp') {
                    $obj = new stdClass();
                    $obj->label = 'Tipo de combustible';
                    $obj->name = 'idcategoriatransp';
                    $obj->descripcion = 'Tipo de combustible';
                    $obj->ownerPlugins = true;
                    $obj->namePlugin = "Datos de transporte";
                    $obj->idPlugin = "transporte";
                    $obj->allowBlank = true;
                    $obj->tipo = 'combo';
                    array_push($result, $obj);
                }
            }
        }
    }

}

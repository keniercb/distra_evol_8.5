<?php

/******************************************************************************
 * Copyright (c) 2016. Todos los derechos reservados. RRHH-XETID              *
 ******************************************************************************/
class Perfil
{

    var $idpersona;
    var $rtf;
    var $sect;
    var $table;

    public function Perfil($ficha_data)
    {
        /*$this->idpersona = $idp;
        $dir = $_SERVER ['DOCUMENT_ROOT'];
        $apps = str_replace('/web', '/', $dir);
        require_once($apps . 'apps/pvd/comun/recursos/rtf/Rtf.php');*/
        $dir = $_SERVER ['DOCUMENT_ROOT'];
        $apps = str_replace('/web', '/', $dir);
        require_once($apps . 'apps/pvd/comun/recursos/rtf/Rtf.php'); //print_r('ffff');die;
        $this->datos = $ficha_data;
    }

//    public function crearEncabezado()
//    {
//        $this->rtf = new Rtf();
//        $this->sect = &$this->rtf->addSection();
//        $this->sect->setPaperHeight(27.94);
//        $this->sect->setPaperWidth(21.59);
//        $this->sect->setMargins(2.5, 2.2, 2.2, 2.2);
//        //$this->sect->writeText('<b>SECRETO P</b>', new Font(18, Arial), new ParFormat('right'));
//        //$this->sect->writeText('<b><u><chdate></u></b>', new Font(18, Arial), new ParFormat());
//        $this->sect->writeText('<b>SÍNTESIS BIOGRÁFICA</b><br>', new Font(18, Arial), new ParFormat('center'));
//    }
//
//    public function crearFotoperfil($foto)
//    {
//        $this->table = &$this->sect->addTable('center');
//        $this->table->addRows(1, 3);
//        $this->table->addColumnsList(array(3));
//        $cell = &$this->table->getCell(1, 1);
//        if (!empty($foto)) {
//            $imagen = 'personaimgs/' . $this->idpersona . $foto[0][extension];
//            $this->table->addImageToCell(1, 1, $imagen, $null0, 3, 3);
//        } else {
//            $imagen = '../../views/images/persona/no-photo-male.png';
//            $this->table->addImageToCell(1, 1, $imagen, $null0, 3, 3);
//        }
//        $this->table->setDefaultAlignmentOfCells('center', 1, 1, 1, 1);
//        $this->table->setVerticalAlignmentOfCells('center', 1, 1, 1, 1);
//        $this->table->setBordersOfCells(new BorderFormat(1, "#000000"), 1, 1, 1, 1);
//    }
//
//    public function crearDatosPersonales($dat_persona, $cargo, $date)
//    {
//        $nombre = $dat_persona->nombre;
//        $nombre = trim($nombre);
//        $snombre = $dat_persona->snombre;
//        $snombre = trim($snombre);
//        $papel = $dat_persona->papel;
//        $papel = trim($papel);
//        $sapel = $dat_persona->sapel;
//        $sapel = trim($sapel);
//        switch ($dat_persona) {
//            case ($dat_persona->snombre != ''):
//                $nombre .= ' ' . $snombre . ' ' . $papel . ' ' . $sapel;
//                break;
//
//            default:
//                $nombre .= ' ' . $papel . ' ' . $sapel;
//                break;
//        }
//        $cargoactual = $cargo;
//        $edad = split(' ', $date[0]['age']);
//        $edad = $edad[1];
//        if ($edad) {
//            $edad = $edad . ' años';
//        }
//        $this->sect->writeText('', new Font(), new ParFormat());
//        $this->table = &$this->sect->addTable('left');
//        $this->table->addRows(3, 0.5);
//        $this->table->addColumnsList(array(6, 11));
//        $this->table->setDefaultAlignmentOfCells('left', 1, 2, 3, 1);
//        $this->table->writeToCell(1, 1, 'Nombres y Apellidos', new Font(18, Arial), new ParFormat());
//        $this->table->writeToCell(1, 2, $nombre, new Font(18, Arial), new ParFormat());
//        $this->table->writeToCell(2, 1, 'Cargo', new Font(18, Arial), new ParFormat());
//        $this->table->writeToCell(2, 2, $cargoactual, new Font(18, Arial), new ParFormat());
//        $this->table->writeToCell(3, 1, 'Edad', new Font(18, Arial), new ParFormat());
//        $this->table->writeToCell(3, 2, $edad, new Font(18, Arial), new ParFormat());
//        $this->sect->writeText('', new Font(), new ParFormat());
//    }
//
//    public function crearTrayectoria($trayectoria)
//    {
//        $filas = '2';
//        $celda = '1';
//        if (!empty($trayectoria)) {
//            $filas += count($trayectoria);
//        }
//        $this->sect->writeText('', new Font(), new ParFormat());
//        $this->table = &$this->sect->addTable('left');
//        $this->table->addRows($filas, 0.5);
//        $this->table->addColumnsList(array(4, 13));
//        $this->table->setBordersOfCells(new BorderFormat(1, "#000000"), 1, 2, $filas, 1);
//        $this->table->writeToCell(1, 1, 'Años', new Font(18, Arial), new ParFormat('center'));
//        $this->table->writeToCell(1, 2, 'Cargos y Organismos', new Font(18, Arial), new ParFormat('center'));
//        for ($i = 0; $i < count($trayectoria); $i++) {
//            $celda++;
//            if ($trayectoria[$i]['fechainicio'] != '' && $trayectoria[$i]['fechafin'] != '') {
//                $anyoi = split('/', $trayectoria[$i]['fechainicio']);
//                $anyof = split('/', $trayectoria[$i]['fechafin']);
//                $anyof = str_split($anyof[2], 2);
//                $annos = $anyoi[2] . '-' . $anyof[1];
//            } elseif ($trayectoria[$i]['fechainicio'] != '') {
//                $anyoi = split('/', $trayectoria[$i]['fechainicio']);
//                $annos = 'Desde el ' . $anyoi[2];
//            }
//            $this->table->writeToCell($celda, 1, $annos, new Font(18, Arial), new ParFormat('center'));
//            if ($trayectoria[$i]['cargo'] != '') {
//                if ($trayectoria[$i]['organismo'] != '')
//                    $cargoyorga = $trayectoria[$i]['cargo'] . ',' . $trayectoria[$i]['organismo'];
//                else
//                    $cargoyorga = $trayectoria[$i]['cargo'];
//            } else $cargoyorga = $trayectoria[$i]['organismo'];
//            $this->table->writeToCell($celda, 2, $cargoyorga, new Font(18, Arial), new ParFormat('center'));
//        }
//        $this->sect->writeText('', new Font(), new ParFormat());
//    }
//
//    public function crearEvaluaciones($text)
//    {
//        $this->table = &$this->sect->addTable('left');
//        $this->table->addRows(2, 0.5);
//        $this->table->addColumnsList(array(17));
//        $this->table->writeToCell(1, 1, 'Evaluaciones:', new Font(18, Arial), new ParFormat('center'));
//        $this->table->writeToCell(2, 1, '', new Font(18, Arial), new ParFormat('left'));
//        $longitud = count($text);
//        for ($i = 0; $i < $longitud; $i++) {
//            if ($i == ($longitud - 1)) {
//                $ult = explode(',/*fin*/', $text[$i]);
//                $this->table->writeToCell(2, 1, $ult[0], new Font(18, Arial), new ParFormat('left'));
//            } else {
//                $this->table->writeToCell(2, 1, $text[$i], new Font(18, Arial), new ParFormat('left'));
//                $this->table->writeToCell(2, 1, ' ', new Font(18, Arial), new ParFormat('left'));
//            }
//        }
//        $this->sect->writeText('', new Font(), new ParFormat());
//    }
//
//    public function crearNumeroRegistro($num)
//    {
//        $num = '<b>R/S:' . $num . '</b>';
//        $this->sect->writeText($num, new Font(12, Arial), new ParFormat('left'));
//    }
    public function salvarPerfil()
    {
        $this->rtf = new Rtf();
        $this->sect = &$this->rtf->addSection();
        $this->sect->setPaperHeight(27.94);
        $this->sect->setPaperWidth(21.59);
        $this->sect->setMargins(1, 2.2, 2.2, 2.2);
        $this->sect->writeText('<b>SÍNTESIS BIOGRÁFICA</b><br>', new Font(18, Arial), new ParFormat('center'));
        $this->table = &$this->sect->addTable('left');
        $this->table->addRows(2, 0.5);
        $this->table->addColumnsList(array(20));
        $this->table->setVerticalAlignmentOfCells('left', 1, 1, 2, 3);
        $this->table->setVerticalAlignmentOfCells('left', 1, 4, 1, 4);
        $this->table->writeToCell(
            1, 1, '<b>' . 'NI - ' . $this->datos['numid'] . ' ' . $this->datos['nombres'] . ' ' . $this->datos['papel'] . ' ' .
            $this->datos['sapel'] . '</b>', new Font(11, Arial), new ParFormat('center')
        );
        $this->table->setBordersOfCells(new BorderFormat(1, "#000000"), 1, 1, 1, 1, true, true, true, true);
        $this->table = &$this->sect->addTable('left');
        $this->table->addRows(3, 0.5);
        $this->table->addColumnsList(array(3.5, 4.5, 12));
        $this->table->setVerticalAlignmentOfCells('left', 1, 1, 2, 3);
        $this->table->setVerticalAlignmentOfCells('left', 1, 4, 1, 4);
        $dirfoto = $_SERVER ['DOCUMENT_ROOT'] . '/pvd/persona/views/images/persona/no-photo-male.png';

        if (!$this->datos['foto']) {
            $this->table->addImageToCell(1, 1, $dirfoto, new ParFormat('left'), 2.92, 2.77);
        } else {
            $this->table->addImageToCell(
                1, 1, $_SERVER ['DOCUMENT_ROOT'] . $this->datos['foto'], new ParFormat('left'), 2.92, 2.77
            );
        }
        $this->table->writeToCell(1, 2, '<b>UBICACIÓN ACTUAL:</b>', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(
            1, 3, $this->datos['cargoactual'] . ' / ' . $this->datos['area'], new Font(11, Arial), new ParFormat('left')
        );

        $this->table = &$this->sect->addTable('left');
        $this->table->addRows(3, 0.5);
        $this->table->addColumnsList(array(5, 4, 4.5, 6));
        $this->table->setVerticalAlignmentOfCells('left', 1, 1, 2, 3);
        $this->table->setVerticalAlignmentOfCells('left', 1, 4, 1, 4);
        $this->table->writeToCell(1, 1, '<b>FECHA DE NACIMIENTO:</b>', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(1, 2, $this->datos['fechanacimiento'], new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(1, 3, '<b>EDAD:</b>', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(1, 4, $this->datos['edad'] . ' años', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(1, 1, '', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(1, 2, '', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(1, 3, '', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(1, 4, '', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(2, 1, '<b>PELO:</b>', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(2, 2, $this->datos['pelo'], new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(2, 3, '<b>OJOS:</b>', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(2, 4, $this->datos['ojos'], new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(2, 1, '', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(2, 2, '', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(2, 3, '', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(2, 4, '', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(3, 1, '<b>PIEL:</b>', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(3, 2, $this->datos['piel'], new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(3, 3, '<b>ESTATURA:</b>', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(3, 4, $this->datos['estatura'] . ' cm', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(3, 1, '', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(3, 2, '', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(3, 3, '', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(3, 4, '', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(3, 1, '<b>PESO:</b>', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(3, 2, $this->datos['peso'] . ' KG', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(3, 3, '<b>GRUPO SANGUINIEO:</b>', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(3, 4, $this->datos['gsanguineo'], new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(3, 1, '', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(3, 2, '', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(3, 3, '', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(3, 4, '', new Font(11, Arial), new ParFormat('left'));


        $this->table = &$this->sect->addTable('left');
        $this->table->addRows(2, 0.5);
        $this->table->addColumnsList(array(5, 15));
        $this->table->setVerticalAlignmentOfCells('left', 1, 1, 2, 3);
        $this->table->setVerticalAlignmentOfCells('left', 1, 4, 1, 4);
        $this->table->writeToCell(1, 1, '<b>LUGAR DE RESIDENCIA:</b>', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(1, 2,
            $this->datos['direccion'], new Font(11, Arial), new ParFormat('left')
        );
        /*$this->table = &$this->sect->addTable('left');
        $this->table->addRows(1, 0.5);
        $this->table->addColumnsList(array(9, 3, 4, 4));
        $this->table->setVerticalAlignmentOfCells('left', 1, 1, 2, 3);
        $this->table->setVerticalAlignmentOfCells('left', 1, 4, 1, 4);

        $this->table->writeToCell(
            1, 1, '<b>PREPARACIÓN CIVIL Y ESPECIALIDAD</b>', new Font(11, Arial), new ParFormat('left')
        );
        $this->table->writeToCell(1, 2, '<b>TIEMPO</b>', new Font(11, Arial), new ParFormat('center'));
        $this->table->writeToCell(1, 3, '<b>TERMINACIÓN</b>', new Font(11, Arial), new ParFormat('center'));
        $this->table->writeToCell(1, 4, '<b>RESULTADO</b>', new Font(11, Arial), new ParFormat('center'));
        $this->table->writeToCell(2, 1, '', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(2, 2, '', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(2, 3, '', new Font(11, Arial), new ParFormat('left'));
        $this->table->writeToCell(2, 4, '', new Font(11, Arial), new ParFormat('left'));



        $this->table->setBordersOfCells(new BorderFormat(1, "#000000"), 1, 4, 1, 1, true, true, true, true);
        $this->table = &$this->sect->addTable('left');
        $this->table->addRows(count($this->datos['preparaciocivil']) + 1, 0.5);
        $this->table->addColumnsList(array(9, 3, 4, 4));
        $this->table->setVerticalAlignmentOfCells('left', 1, 1, 2, 3);
        $this->table->setVerticalAlignmentOfCells('left', 1, 4, 1, 4);
        $preparaciocivil = $this->datos['preparaciocivil'];
        $i = 1;
        foreach ($preparaciocivil as $key => $valor) {
            $this->table->writeToCell($i, 1, $valor['curso'] . '/' . $valor['denomcentroestudio'], new Font(11, Arial), new ParFormat('left'));
            $fechadesde = explode('/', $valor['fdesde']);
            if ($valor['fhasta'] == null) {
                $yearactual = date('Y');
                $years = $yearactual - $fechadesde[2];
            } else {
                $fechahasta = explode('/', $valor['fhasta']);
                $years = $fechahasta[2] - $fechadesde[2];
            }
            $this->table->writeToCell($i, 2, $years . 'a ', new Font(11, Arial), new ParFormat('center'));
            $this->table->writeToCell($i, 3, $valor['fhasta'], new Font(11, Arial), new ParFormat('center'));
            $this->table->writeToCell($i, 4, $valor['resultado'], new Font(11, Arial), new ParFormat('center'));
            $i++;
        }
        */

        /*$this->table = &$this->sect->addTable('left');
        $this->table->addRows(1, 0.5);
        $this->table->addColumnsList(array(13.5, 4.5, 2));
        $this->table->setVerticalAlignmentOfCells('left', 1, 1, 2, 3);
        $this->table->setVerticalAlignmentOfCells('left', 1, 4, 1, 4);
        $this->table->writeToCell(
            1, 1, '<b>SANCIONES POLÍTICAS, ADMINISTRATIVAS O DE OTRA INDOLE</b>', new Font(11, Arial), new ParFormat('left')
        );
        $this->table->writeToCell(1, 2, '<b>FECHA IMPOSICIÓN</b>', new Font(11, Arial), new ParFormat('center'));
        $this->table->writeToCell(1, 3, '<b>DESDE</b>', new Font(11, Arial), new ParFormat('center'));
        $this->table->setBordersOfCells(new BorderFormat(1, "#000000"), 1, 3, 1, 1, true, true, true, true);

        $this->table = &$this->sect->addTable('left');
        $this->table->addRows(count($this->datos['sanciones']) + 1, 0.5);
        $this->table->addColumnsList(array(13.5, 4.5, 2));
        $this->table->setVerticalAlignmentOfCells('left', 1, 1, 2, 3);
        $this->table->setVerticalAlignmentOfCells('left', 1, 4, 1, 4);
        $sanciones = $this->datos['sanciones'];
        $i = 1;
        foreach ($sanciones as $key => $valor) {
            $this->table->writeToCell(
                $i, 1, $valor['denomtiposancion'] . ', ' . $valor['denommotivosancion'] . ', ' . $valor['denomsancion'],
                new Font(11, Arial), new ParFormat('left')
            );
            $this->table->writeToCell($i, 2, $valor['fimposicion'], new Font(11, Arial), new ParFormat('center'));
            $this->table->writeToCell($i, 3, $valor['fdesde'], new Font(11, Arial), new ParFormat('center'));
            $i++;
        }
        /*$this->table = &$this->sect->addTable('left');
        $this->table->addRows(1, 0.5);
        $this->table->addColumnsList(array(9, 3, 4, 4));
        $this->table->setVerticalAlignmentOfCells('left', 1, 1, 2, 3);
        $this->table->setVerticalAlignmentOfCells('left', 1, 4, 1, 4);
        $this->table->writeToCell(
            1, 1, '<b>PRINCIPALES CARGOS OCUPADOS</b>', new Font(11, Arial), new ParFormat('left')
        );
        $this->table->writeToCell(1, 2, '<b>DESDE</b>', new Font(11, Arial), new ParFormat('center'));
        $this->table->writeToCell(1, 3, '<b>HASTA</b>', new Font(11, Arial), new ParFormat('center'));
        $this->table->writeToCell(1, 4, '<b>TIEMPO</b>', new Font(11, Arial), new ParFormat('center'));

        $this->table->setBordersOfCells(new BorderFormat(1, "#000000"), 1, 4, 1, 1, true, true, true, true);
        $this->table = &$this->sect->addTable('left');
        $this->table->addRows(count($this->datos['trayectoria']) + 1, 0.5);
        $this->table->addColumnsList(array(9, 3, 4, 4));
        $this->table->setVerticalAlignmentOfCells('left', 1, 1, 2, 3);
        $this->table->setVerticalAlignmentOfCells('left', 1, 4, 1, 4);
        $trayectoria = $this->datos['trayectoria'];
        $i = 1;
        foreach ($trayectoria as $key => $valor) {
            $this->table->writeToCell(
                $i, 1, '- ' . $valor['entidad'] . ', ' . $valor['area'] . ', ' . $valor['cargo'], new Font(11, Arial),
                new ParFormat('left')
            );
            $this->table->writeToCell($i, 2, $valor['fdesde'], new Font(11, Arial), new ParFormat('center'));
            $this->table->writeToCell($i, 3, $valor['fhasta'], new Font(11, Arial), new ParFormat('center'));
            $fechadesde = explode('/', $valor['fdesde']);
            if ($valor['fhasta'] == null) {
                $yearactual = date('Y');
                $mesactual = date('m');
                $meses = $mesactual - $fechadesde[1];
                $years = $yearactual - $fechadesde[2];
            } else {
                $fechahasta = explode('/', $valor['fhasta']);
                $meses = $fechahasta[1] - $fechadesde[1];
                $years = $fechahasta[2] - $fechadesde[2];
            }
            $this->table->writeToCell(
                $i, 4, $years . 'a ' . $meses . 'm', new Font(11, Arial), new ParFormat('center')
            );
            $i++;
        }


        $this->table = &$this->sect->addTable('left');
        $this->table->addRows(1, 0.5);
        $this->table->addColumnsList(array(9, 3, 4, 4));
        $this->table->setVerticalAlignmentOfCells('left', 1, 1, 2, 3);
        $this->table->setVerticalAlignmentOfCells('left', 1, 4, 1, 4);
        $this->table->writeToCell(
            1, 1, '<b>AFILIACIONES</b>', new Font(11, Arial), new ParFormat('left')
        );
        $this->table->writeToCell(1, 2, '<b>TIPO</b>', new Font(11, Arial), new ParFormat('center'));
        $this->table->writeToCell(1, 3, '<b>DESDE</b>', new Font(11, Arial), new ParFormat('center'));
        $this->table->writeToCell(1, 4, '<b>HASTA</b>', new Font(11, Arial), new ParFormat('center'));

        $this->table->setBordersOfCells(new BorderFormat(1, "#000000"), 1, 4, 1, 1, true, true, true, true);
        $this->table = &$this->sect->addTable('left');
        $this->table->addRows(count($this->datos['afiliaciones']) + 1, 0.5);
        $this->table->addColumnsList(array(9, 3, 4, 4));
        $this->table->setVerticalAlignmentOfCells('left', 1, 1, 2, 3);
        $this->table->setVerticalAlignmentOfCells('left', 1, 4, 1, 4);
        $afiliaciones = $this->datos['afiliaciones'];
        $i = 1;
        foreach ($afiliaciones as $key => $valor) {
            $this->table->writeToCell(
                $i, 1, $valor['denomorganizacion'], new Font(11, Arial), new ParFormat('left')
            );
            $this->table->writeToCell($i, 2, $valor['denomtipoorganizacion'],
                new Font(11, Arial), new ParFormat('center'));
            $this->table->writeToCell($i, 3, $valor['fdesde'], new Font(11, Arial), new ParFormat('center'));
            $this->table->writeToCell($i, 4, $valor['fhasta'], new Font(11, Arial), new ParFormat('center'));
            $i++;
        }

        $this->table = &$this->sect->addTable('left');
        $this->table->addRows(1, 0.5);
        $this->table->addColumnsList(array(9, 3, 4, 4));
        $this->table->setVerticalAlignmentOfCells('left', 1, 1, 2, 3);
        $this->table->setVerticalAlignmentOfCells('left', 1, 4, 1, 4);
        $this->table->writeToCell(
            1, 1, '<b>MOTIVO DE SALIDA</b>', new Font(11, Arial), new ParFormat('left')
        );
        $this->table->writeToCell(1, 2, '<b>TIPO ESTANCIA</b>', new Font(11, Arial), new ParFormat('center'));
        $this->table->writeToCell(1, 3, '<b>CARGO</b>', new Font(11, Arial), new ParFormat('center'));
        $this->table->writeToCell(1, 4, '<b>DESDE-HASTA</b>', new Font(11, Arial), new ParFormat('center'));
        $this->table->writeToCell(1, 5, '<b>HASTA</b>', new Font(11, Arial), new ParFormat('center'));

        $this->table->setBordersOfCells(new BorderFormat(1, "#000000"), 1, 4, 1, 1, true, true, true, true);
        $this->table = &$this->sect->addTable('left');
        $this->table->addRows(count($this->datos['estanciaexterior']) + 1, 0.5);
        $this->table->addColumnsList(array(9, 3, 4, 4));
        $this->table->setVerticalAlignmentOfCells('left', 1, 1, 2, 3);
        $this->table->setVerticalAlignmentOfCells('left', 1, 4, 1, 4);
        $afiliaciones = $this->datos['estanciaexterior'];
        $i = 1;
        foreach ($afiliaciones as $key => $valor) {
            $this->table->writeToCell(
                $i, 1, $valor['denomtipomision'] . ' ' . $valor['denommision'], new Font(11, Arial), new ParFormat('left')
            );
            $this->table->writeToCell($i, 2, $valor['denomtipoestanciaexterior'],
                new Font(11, Arial), new ParFormat('center'));
            $this->table->writeToCell($i, 3, $valor['cargo'], new Font(11, Arial), new ParFormat('center'));
            $this->table->writeToCell($i, 4, $valor['fdesde'] . '-' . $valor['fhasta'], new Font(11, Arial),
                new ParFormat('center'));
            $i++;
        }
        */

        $this->rtf->save('SitesisBio.rtf');
    }

}
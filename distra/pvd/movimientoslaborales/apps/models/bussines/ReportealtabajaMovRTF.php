<?php
class ReportealtabajaMovRTF
{
    var $rtf;
    var $datos;

    public function ReportealtabajaMovRTF($tipo, $fi, $ff, $fichaData)
    {
        $dir = $_SERVER ['DOCUMENT_ROOT'];
        $apps = str_replace('/web', '/', $dir);
        require_once($apps . 'apps/pvd/comun/recursos/rtf/Rtf.php');
        $this->datos = $fichaData;
        $this->tipo = $tipo;
        $this->fi = $fi;
        $this->ff = $ff;
    }

    public function CrearFicha()
    {
        $this->rtf = new Rtf();
        $sect = &$this->rtf->addSection();
        $sect->setPaperHeight(21.59);
        $sect->setPaperWidth(27.94);
        $sect->setMargins(0.5, 0.5, 0.5, 0.5);

        $sect->writeText(
            '<br/><b>Registro de ' . $this->tipo . 's desde ' . $this->fi . ' - ' . $this->ff . '</b><br/>',
            new Font(10, Arial), new ParFormat('center')
        );

        $table = &$sect->addTable('left');
        $table->addRows(1, 0.5);
        $table->addColumnsList(array(1.0, 2.1, 7, 2.1, 5, 5, 5));
        $table->setDefaultAlignmentOfCells('center', 1, 1, 1, 7);
        $table->setVerticalAlignmentOfCells('center', 1, 1, 1, 7);
        $cell = &$table->getCell(1, 1);
        $cell->writeText("<b>No.</b>", new Font(8, Arial), new ParFormat('center'));
        $cellP = &$table->getCell(1, 2);
        $cellP->writeText("<b>No. identidad</b>", new Font(8, Arial), new ParFormat('center'));
        $cellP = &$table->getCell(1, 3);
        $cellP->writeText("<b>Apellidos y nombres</b>", new Font(8, Arial), new ParFormat('center'));
        $cellP = &$table->getCell(1, 4);
        $cellP->writeText("<b>Fecha de " . $this->tipo . "</b>", new Font(8, Arial), new ParFormat('center'));
        $cellP = &$table->getCell(1, 5);
        $cellP->writeText("<b>Tipo de contrato</b>", new Font(8, Arial), new ParFormat('center'));
        $cellP = &$table->getCell(1, 6);
        $cellP->writeText(($this->tipo == 'alta')?utf8_decode('<b>Situación laboral</b>'):'<b>Motivo de '.$this->tipo.'</b>', new Font(8, Arial), new ParFormat('center'));
        $cellP = &$table->getCell(1, 7);
        $cellP->writeText("<b>Denominación del cargo</b>", new Font(8, Arial), new ParFormat('center'));
        $table->setBordersOfCells(new BorderFormat(1, "#000000"), 1, 1, 1, 7, true, true, true, true);
        $table->setBackGroundOfCells('#bbbbbb', 1, 1, 1, 7);


        foreach ($this->datos as $p => $value) {
            if ($value['denomentidad'] != $this->datos[$p - 1]['denomentidad']) {
                $table = &$sect->addTable('left');
                $table->addRows(1, 0.5);
                $table->addColumnsList(array(27.2));
                $table->setDefaultAlignmentOfCells('center', 1, 1, 1, 1);
                $table->setVerticalAlignmentOfCells('center', 1, 1, 1, 1);
                $table->setBordersOfCells(new BorderFormat(1, "#000000"), 1, 1, 1, 1, true, true, true, true);
                $table->writeToCell(1, 1, '<b>'.utf8_decode($value['denomentidad']).'</b>', new Font(8, Arial), new ParFormat('center'));
                $table->setBackGroundOfCells('#ececec', 1, 1);

            }
            if ($value['idarea'] != $this->datos[$p - 1]['idarea']) {
                $table = &$sect->addTable('left');
                $table->addRows(1, 0.5);
                $table->addColumnsList(array(27.2));
                $table->setDefaultAlignmentOfCells('left', 1, 1, 1, 1);
                $table->setVerticalAlignmentOfCells('center', 1, 1, 1, 1);
                $table->setBordersOfCells(new BorderFormat(1, "#000000"), 1, 1, 1, 1, true, true, true, true);
                $table->writeToCell(1, 1, '<b>'.utf8_decode($value['denomarea']).'</b>', new Font(8, Arial), new ParFormat('left'));
                $table->setBackGroundOfCells('#ececec', 1, 1);
            }
                $table = &$sect->addTable('left');
                $table->addRows(1, 0.5);
                $table->addColumnsList(array(1.0, 2.1, 7, 2.1, 5, 5, 5));
                $table->setDefaultAlignmentOfCells('center', 1, 1, 1, 7);
                $table->setVerticalAlignmentOfCells('center', 1, 1, 1, 7);
                $table->setBordersOfCells(new BorderFormat(1, "#000000"), 1, 1, 1, 7, true, true, true, true);
            $table->writeToCell(1, 1, $p + 1, new Font(8, Arial), new ParFormat('center'));
            $table->writeToCell(1, 2, ' ' . $value['numid'], new Font(8, Arial), new ParFormat());
            $table->writeToCell(1, 3, ' ' . $value['nombreyapellidos'], new Font(8, Arial), new ParFormat());
            if ($this->tipo == 'alta') {
                $table->writeToCell(1, 4, ' ' . $value['fdesde'], new Font(8, Arial), new ParFormat());
            } else {
                $table->writeToCell(1, 4, ' ' . $value['fhasta'], new Font(8, Arial), new ParFormat());
            }
            $table->writeToCell(1, 5, ' ' . $value['tipocontrato'], new Font(8, Arial), new ParFormat());
            $table->writeToCell(1, 6, ' ' . $value['motivo'], new Font(8, Arial), new ParFormat());
            $table->writeToCell(1, 7, ' ' . $value['cargo'], new Font(8, Arial), new ParFormat());
        }
        $this->rtf->save("Reporte ".$this->tipo.".rtf");
    }

}
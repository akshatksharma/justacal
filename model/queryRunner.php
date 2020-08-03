<?php

class queryRunner
{
    public $mysqli;

    public function connect()
    {
        $this->mysqli = new mysqli('localhost', 'wustl_inst', 'wustl_pass', 'calendar');

        if ($this->mysqli->connect_errno) {
            printf("Connection Failed: %s\n", $this->mysqli->connect_error);
            exit;
        }
    }

    public function query($query, $types = null, $items = null)
    {
        $stmt = $this->mysqli->prepare($query);

        if (!$stmt) {
            printf("Query Prep Failed: %s\n", $this->mysqli->error);
            return false;
        } else {
            if ($types != null && $items != null) {
                $stmt->bind_param($types, ...$items);
            }

            $stmt->execute();

            $result = $stmt->get_result();

            return $result;

        }

    }

    public function insert($query, $types = null, $items = null)
    {
        $stmt = $this->mysqli->prepare($query);

        if (!$stmt) {
            printf("Query Prep Failed: %s\n", $this->mysqli->error);
            exit;
        }

        $stmt->bind_param($types, ...$items);
        $stmt->execute();
        $stmt->close();
    }

}
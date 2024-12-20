 this.dataSource = [
      ...this.dataSource.slice(0, index),
      row,
      ...this.dataSource.slice(index + 1),
    ];